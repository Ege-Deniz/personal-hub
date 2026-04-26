// One-shot bake: sample N points uniformly over the surface of a GLB mesh
// and write a Float32Array as a TS module for static import.
//
// Usage:
//   node scripts/bake-fire-points.mjs <input.glb> <output.ts> [count]
//
// Default count: 5000 (matches CORE_PARTICLE_COUNT in SpatialBackground.tsx).
// Output is normalized: centered at AABB midpoint, max radius = 1.

import { NodeIO } from "@gltf-transform/core";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , inputArg, outputArg, countArg] = process.argv;
if (!inputArg || !outputArg) {
  console.error("usage: bake-fire-points.mjs <input.glb> <output.ts> [count]");
  process.exit(1);
}

const COUNT = Number.parseInt(countArg ?? "5000", 10);
const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);

console.log(`reading ${inputPath} ...`);
const io = new NodeIO();
const doc = await io.read(inputPath);
const root = doc.getRoot();

// Walk every node, accumulate world matrices, collect transformed triangles.
const triangles = [];
let triCount = 0;

const mat4Identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const mat4Mul = (a, b) => {
  const r = new Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      r[j*4+i] = a[0*4+i]*b[j*4+0] + a[1*4+i]*b[j*4+1] + a[2*4+i]*b[j*4+2] + a[3*4+i]*b[j*4+3];
    }
  }
  return r;
};
const mat4Transform = (m, x, y, z) => [
  m[0]*x + m[4]*y + m[8]*z  + m[12],
  m[1]*x + m[5]*y + m[9]*z  + m[13],
  m[2]*x + m[6]*y + m[10]*z + m[14],
];

const getNodeMatrix = (node) => {
  const m = node.getMatrix();
  if (m) return Array.from(m);
  const t = node.getTranslation();
  const r = node.getRotation();
  const s = node.getScale();
  const [qx, qy, qz, qw] = r;
  const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
  const xx = qx * x2, xy = qx * y2, xz = qx * z2;
  const yy = qy * y2, yz = qy * z2, zz = qz * z2;
  const wx = qw * x2, wy = qw * y2, wz = qw * z2;
  return [
    (1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0,
    (xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0,
    (xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0,
    t[0], t[1], t[2], 1,
  ];
};

const visit = (node, parentMat) => {
  const local = getNodeMatrix(node);
  const world = mat4Mul(parentMat, local);
  const mesh = node.getMesh();
  if (mesh) {
    for (const prim of mesh.listPrimitives()) {
      const positions = prim.getAttribute("POSITION");
      if (!positions) continue;
      const posArr = positions.getArray();
      const stride = positions.getElementSize();
      const indices = prim.getIndices();
      const idxArr = indices ? indices.getArray() : null;
      const triCountPrim = idxArr ? idxArr.length / 3 : (posArr.length / stride) / 3;
      for (let t = 0; t < triCountPrim; t++) {
        const i0 = idxArr ? idxArr[t*3 + 0] : t*3 + 0;
        const i1 = idxArr ? idxArr[t*3 + 1] : t*3 + 1;
        const i2 = idxArr ? idxArr[t*3 + 2] : t*3 + 2;
        const a = mat4Transform(world, posArr[i0*stride], posArr[i0*stride+1], posArr[i0*stride+2]);
        const b = mat4Transform(world, posArr[i1*stride], posArr[i1*stride+1], posArr[i1*stride+2]);
        const c = mat4Transform(world, posArr[i2*stride], posArr[i2*stride+1], posArr[i2*stride+2]);
        const ux = b[0]-a[0], uy = b[1]-a[1], uz = b[2]-a[2];
        const vx = c[0]-a[0], vy = c[1]-a[1], vz = c[2]-a[2];
        const cx = uy*vz - uz*vy;
        const cy = uz*vx - ux*vz;
        const cz = ux*vy - uy*vx;
        const area = 0.5 * Math.sqrt(cx*cx + cy*cy + cz*cz);
        if (area <= 0 || !Number.isFinite(area)) continue;
        const cenx = (a[0]+b[0]+c[0])/3, ceny = (a[1]+b[1]+c[1])/3, cenz = (a[2]+b[2]+c[2])/3;
        const inv = 1/Math.sqrt(cx*cx+cy*cy+cz*cz);
        triangles.push({ a, b, c, area, cen:[cenx,ceny,cenz], n:[cx*inv,cy*inv,cz*inv] });
        triCount++;
      }
    }
  }
  for (const child of node.listChildren()) visit(child, world);
};

for (const scene of root.listScenes()) {
  for (const node of scene.listChildren()) visit(node, mat4Identity());
}

console.log(`triangles total: ${triCount}`);
if (triCount === 0) { console.error("no triangles found in GLB"); process.exit(2); }

// Cull inward-facing triangles to recover the silhouette shell. Without
// this, samples drawn from interior surfaces of the GLB blur the figure.
let bx0=+Infinity,by0=+Infinity,bz0=+Infinity,bx1=-Infinity,by1=-Infinity,bz1=-Infinity;
for (const tri of triangles) {
  const [x,y,z] = tri.cen;
  if (x<bx0) bx0=x; if (y<by0) by0=y; if (z<bz0) bz0=z;
  if (x>bx1) bx1=x; if (y>by1) by1=y; if (z>bz1) bz1=z;
}
const mx=(bx0+bx1)/2, my=(by0+by1)/2, mz=(bz0+bz1)/2;
const before = triangles.length;
let writeIdx = 0;
for (let i = 0; i < triangles.length; i++) {
  const { cen, n } = triangles[i];
  const dx=cen[0]-mx, dy=cen[1]-my, dz=cen[2]-mz;
  const len = Math.sqrt(dx*dx+dy*dy+dz*dz);
  if (len < 1e-6 || (n[0]*dx + n[1]*dy + n[2]*dz) / len > 0) {
    triangles[writeIdx++] = triangles[i];
  }
}
triangles.length = writeIdx;
console.log(`triangles after outward-facing cull: ${triangles.length} (kept ${(triangles.length/before*100).toFixed(1)}%)`);

const cum = new Float64Array(triangles.length);
let total = 0;
for (let i = 0; i < triangles.length; i++) {
  total += triangles[i].area;
  cum[i] = total;
}
console.log(`total surface area: ${total.toFixed(2)}`);

const points = new Float32Array(COUNT * 3);
const pickTri = (r) => {
  let lo = 0, hi = cum.length - 1;
  const target = r * total;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < target) lo = mid + 1; else hi = mid;
  }
  return lo;
};

for (let i = 0; i < COUNT; i++) {
  const tri = triangles[pickTri(Math.random())];
  let u = Math.random(), v = Math.random();
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  const w = 1 - u - v;
  points[i*3+0] = tri.a[0]*w + tri.b[0]*u + tri.c[0]*v;
  points[i*3+1] = tri.a[1]*w + tri.b[1]*u + tri.c[1]*v;
  points[i*3+2] = tri.a[2]*w + tri.b[2]*u + tri.c[2]*v;
}

let minX=+Infinity,minY=+Infinity,minZ=+Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
for (let i = 0; i < COUNT; i++) {
  const x=points[i*3], y=points[i*3+1], z=points[i*3+2];
  if (x<minX) minX=x; if (y<minY) minY=y; if (z<minZ) minZ=z;
  if (x>maxX) maxX=x; if (y>maxY) maxY=y; if (z>maxZ) maxZ=z;
}
const cxn=(minX+maxX)/2, cyn=(minY+maxY)/2, czn=(minZ+maxZ)/2;
let maxR = 0;
for (let i = 0; i < COUNT; i++) {
  const x=points[i*3]-cxn, y=points[i*3+1]-cyn, z=points[i*3+2]-czn;
  const r=Math.sqrt(x*x+y*y+z*z);
  if (r>maxR) maxR=r;
}
const inv = 1/maxR;
for (let i = 0; i < COUNT; i++) {
  points[i*3+0] = (points[i*3+0]-cxn)*inv;
  points[i*3+1] = (points[i*3+1]-cyn)*inv;
  points[i*3+2] = (points[i*3+2]-czn)*inv;
}

console.log(`sampled ${COUNT} points; bbox(${minX.toFixed(2)}..${maxX.toFixed(2)}, ${minY.toFixed(2)}..${maxY.toFixed(2)}, ${minZ.toFixed(2)}..${maxZ.toFixed(2)})`);

const buf = Buffer.from(points.buffer);
const b64 = buf.toString("base64");

const out = `// AUTO-GENERATED by scripts/bake-fire-points.mjs - do not edit by hand.
// Source: ${inputArg}
// Count: ${COUNT}, normalized: centered at AABB midpoint, max radius = 1.

const B64 = "${b64}";

const decode = (s: string): Float32Array => {
  if (typeof atob === "function") {
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Float32Array(bytes.buffer);
  }
  const buf = Buffer.from(s, "base64");
  const arr = new Float32Array(buf.byteLength / 4);
  for (let i = 0; i < arr.length; i++) arr[i] = buf.readFloatLE(i * 4);
  return arr;
};

export const FIRE_POINT_COUNT = ${COUNT};
export const FIRE_POINTS = decode(B64);
`;

writeFileSync(outputPath, out);
console.log(`wrote ${outputPath} (${(buf.length/1024).toFixed(1)} KB binary, ${(out.length/1024).toFixed(1)} KB TS)`);
