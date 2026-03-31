"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── COMPACT NETWORK: 3 → 4 → 3 ───
const LAYERS = [3, 4, 3];

interface Node {
  x: number;
  y: number;
  layer: number;
  idx: number;
  activation: number;
  target: number;
  error: number;
}

interface Connection {
  from: Node;
  to: Node;
  weight: number;
  signal: number;
  gradient: number;
}

export default function BackpropEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-30px" });
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const connsRef = useRef<Connection[]>([]);
  const timeRef = useRef(0);
  const [loss, setLoss] = useState(2.4137);
  const [phase, setPhase] = useState<"idle" | "forward" | "backward">("idle");
  const [epoch, setEpoch] = useState(0);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const buildNetwork = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    const conns: Connection[] = [];
    const padX = 36;
    const usableW = w - padX * 2;
    const layerGap = usableW / (LAYERS.length - 1);

    LAYERS.forEach((count, li) => {
      const x = padX + layerGap * li;
      const padY = 18;
      const usableH = h - padY * 2;
      const nodeGap = usableH / (count - 1 || 1);
      for (let ni = 0; ni < count; ni++) {
        const y = count === 1 ? h / 2 : padY + nodeGap * ni;
        nodes.push({ x, y, layer: li, idx: ni, activation: 0, target: 0, error: 0 });
      }
    });

    for (let li = 0; li < LAYERS.length - 1; li++) {
      const from = nodes.filter((n) => n.layer === li);
      const to = nodes.filter((n) => n.layer === li + 1);
      from.forEach((fn) =>
        to.forEach((tn) =>
          conns.push({ from: fn, to: tn, weight: (Math.random() - 0.5) * 1.2, signal: 0, gradient: 0 })
        )
      );
    }

    nodesRef.current = nodes;
    connsRef.current = conns;
  }, []);

  const pulseWeights = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("forward");
    const nodes = nodesRef.current;
    const conns = connsRef.current;

    // Set inputs
    nodes.filter((n) => n.layer === 0).forEach((n) => {
      n.activation = Math.random();
      n.target = n.activation;
    });

    // Forward pass
    for (let li = 1; li < LAYERS.length; li++) {
      nodes.filter((n) => n.layer === li).forEach((node) => {
        let sum = 0;
        conns.filter((c) => c.to === node).forEach((c) => (sum += c.from.activation * c.weight));
        node.activation = sigmoid(sum);
        node.target = node.activation;
      });
    }

    // Visual: light up forward signals
    conns.forEach((c) => (c.signal = Math.abs(c.weight) * 0.7));

    setTimeout(() => {
      setPhase("backward");
      const outputs = nodes.filter((n) => n.layer === LAYERS.length - 1);
      const targets = outputs.map(() => Math.random());
      let totalLoss = 0;

      outputs.forEach((n, i) => {
        const err = targets[i] - n.activation;
        n.error = err * n.activation * (1 - n.activation);
        totalLoss += err * err;
      });

      for (let li = LAYERS.length - 2; li >= 0; li--) {
        nodes.filter((n) => n.layer === li).forEach((node) => {
          let errSum = 0;
          conns.filter((c) => c.from === node).forEach((c) => {
            errSum += c.to.error * c.weight;
            c.gradient = Math.abs(c.to.error * node.activation);
            c.weight += 0.1 * c.to.error * node.activation;
          });
          node.error = errSum * node.activation * (1 - node.activation);
        });
      }

      setLoss((prev) => Math.max(0.001, prev * 0.8 + (totalLoss / outputs.length) * 0.2));
      setEpoch((prev) => prev + 1);
      setTimeout(() => setPhase("idle"), 1600);
    }, 1200);
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, w, h);

      const conns = connsRef.current;
      const nodes = nodesRef.current;

      // ─── Draw connections as elegant Bezier curves ───
      conns.forEach((c) => {
        const sig = c.signal;
        const grad = c.gradient;
        const midX = (c.from.x + c.to.x) / 2;

        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.bezierCurveTo(midX, c.from.y, midX, c.to.y, c.to.x, c.to.y);

        const alpha = 0.035 + sig * 0.25 + grad * 0.35;
        if (grad > 0.02) {
          ctx.strokeStyle = `rgba(212, 168, 83, ${Math.min(alpha, 0.45)})`;
        } else {
          ctx.strokeStyle = `rgba(0, 229, 255, ${Math.min(alpha, 0.3)})`;
        }
        ctx.lineWidth = 0.6 + sig * 1.2 + grad * 0.8;
        ctx.stroke();

        // Decay
        c.signal *= 0.94;
        c.gradient *= 0.95;
      });

      // ─── Draw nodes ───
      nodes.forEach((n) => {
        n.activation += (n.target - n.activation) * 0.08;
        n.target *= 0.98;
        n.error *= 0.95;

        const r = 3.5 + n.activation * 3 + n.error * 2.5;

        // Outer glow
        if (n.activation > 0.15 || n.error > 0.05) {
          const glowR = r + 6;
          const isErr = n.error > 0.1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = isErr
            ? `rgba(212, 168, 83, ${n.error * 0.1})`
            : `rgba(0, 229, 255, ${n.activation * 0.07})`;
          ctx.fill();
        }

        // Core
        const a = 0.18 + n.activation * 0.55 + n.error * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle =
          n.error > 0.1
            ? `rgba(212, 168, 83, ${a})`
            : `rgba(0, 229, 255, ${a})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    if (isInView) draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isInView, buildNetwork]);

  // Auto-pulse on first view
  useEffect(() => {
    if (isInView && epoch === 0) {
      const t = setTimeout(pulseWeights, 700);
      return () => clearTimeout(t);
    }
  }, [isInView, epoch, pulseWeights]);

  return (
    <div ref={containerRef} className="relative h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-1">
        <div className="font-mono text-[0.38rem] tracking-[3px] uppercase text-cyan/40 mb-1.5 flex items-center gap-1.5">
          <span className="w-2.5 h-px bg-cyan/40" />
          Neural Simulation
        </div>
        <h3 className="font-display text-[1rem] font-bold tracking-tight leading-tight">
          Backpropagation Engine
        </h3>
        <p className="font-serif italic text-[0.75rem] text-white/45 mt-0.5">
          Zurada&apos;s foundations — interactive
        </p>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 mx-3 mb-2 min-h-[100px]">
        <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
        <div className="absolute bottom-1.5 right-2.5 flex items-center gap-2.5">
          <span className="font-mono text-[0.38rem] text-white/25">
            Ep: <span className="text-cyan/50">{epoch}</span>
          </span>
          <span className="font-mono text-[0.38rem] text-white/25">
            Loss:{" "}
            <motion.span className="text-gold/70" key={loss.toFixed(4)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
              {loss.toFixed(4)}
            </motion.span>
          </span>
        </div>
      </div>

      {/* Button */}
      <div className="px-4 pb-3">
        <button
          onClick={pulseWeights}
          disabled={phase !== "idle"}
          className="w-full font-mono text-[0.55rem] uppercase tracking-[1.5px] py-2 rounded-md border border-cyan/12 text-cyan/50 bg-cyan/[0.02] hover:border-cyan/35 hover:text-cyan hover:bg-cyan/[0.05] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          {phase === "forward" ? "Forward →" : phase === "backward" ? "← Backward" : "Pulse Weights"}
        </button>
      </div>
    </div>
  );
}
