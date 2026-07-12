// Single source of truth for the work archive — every ledger/archive variant
// in the redesign reads from here. Rule: every receipt string must be
// verifiable in a repo, a thesis, or a live domain. No decorative claims.

export type ArtifactLink = { label: string; href: string };

export type Artifact = {
  id: string;
  index: string; // ledger index, e.g. "001"
  title: string;
  lane: string; // mono lane label
  year: string;
  shipped: string; // ISO date of the anchoring receipt
  summary: string;
  receipts: string[];
  links: ArtifactLink[];
  /** /public path of the hover receipt-clip or still; null until Ege records it */
  media: string | null;
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "backprop",
    index: "001",
    title: "Backprop, in C",
    lane: "ml · first principles",
    year: "2026",
    shipped: "2026-07-01",
    summary:
      "The backpropagation algorithm derived and implemented from scratch in C — a 35-10-6 network on bipolar digit patterns, with a browser demo running the C-exported weights.",
    receipts: [
      "written in C, no framework",
      "converged @ epoch 207",
      "6/6 clean classification",
      "noise 100 / 100 / 98.3 %",
      "thesis defended 2026-07-01",
    ],
    links: [
      { label: "deck + live demo", href: "https://backprop-public.vercel.app" },
    ],
    media: null,
  },
  {
    id: "brain-operator",
    index: "002",
    title: "Brain Operator",
    lane: "agent devtools",
    year: "2026",
    shipped: "2026-05-28",
    summary:
      "An Obsidian vault becomes agent devtools: spawn a local Claude Code session, stream every tool call, trace every answer back to its source note.",
    receipts: [
      "v0.6.6 · public",
      "parser 117/117",
      "cold-install 18/18",
      "apply-guard e2e 6/6",
    ],
    links: [
      { label: "live", href: "https://brainoperator.rowy.engineer" },
      { label: "github", href: "https://github.com/Ege-Deniz/brain-operator" },
    ],
    media: "/brain-operator-preview.png",
  },
  {
    id: "zen-archery",
    index: "003",
    title: "Zen Archery for Builders",
    lane: "agent discipline",
    year: "2026",
    shipped: "2026-04-15",
    summary:
      "A former national archer's shot routine rebuilt as session discipline for AI-assisted engineering; public methodology repo packaged as a Claude Code plugin.",
    receipts: ["public repo", "claude plugin validates", "launched 2026-04-15"],
    links: [
      {
        label: "github",
        href: "https://github.com/Ege-Deniz/zen-archery-for-builders",
      },
    ],
    media: null,
  },
  {
    id: "siba",
    index: "004",
    title: "SIBA",
    lane: "spatial web",
    year: "2025",
    shipped: "2025-12-01",
    summary:
      "A WebGL experience site — three.js scenes, custom shaders, motion built as one continuous piece rather than a page stack.",
    receipts: ["three.js + GLSL", "shipped on its own domain"],
    links: [{ label: "siba.rowy.engineer", href: "https://siba.rowy.engineer" }],
    media: null,
  },
  {
    id: "field",
    index: "005",
    title: "This field",
    lane: "spatial web · meta",
    year: "2026",
    shipped: "2026-06-10",
    summary:
      "The site's own instrument: instanced particles with hand-tuned GPGPU morph targets and a keyframed camera rig. Exhibit A.",
    receipts: ["5,360 instanced particles", "GPGPU morph targets", "open source"],
    links: [
      { label: "source", href: "https://github.com/Ege-Deniz/personal-hub" },
    ],
    media: null,
  },
];
