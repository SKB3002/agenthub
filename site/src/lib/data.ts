export type Tier = "LIGHT" | "MEDIUM" | "HEAVY";

export type Command = {
  name: string;
  args?: string;
  tier: Tier;
  tokens: string;
  desc: string;
};

export const COMMANDS: Command[] = [
  { name: "brainstorm", args: "<idea>", tier: "MEDIUM", tokens: "10k–30k", desc: "Explore 3+ options with trade-offs — no code, ideas only." },
  { name: "budget", args: "[low|medium|ok|clear]", tier: "LIGHT", tokens: "<2k", desc: "Opt-in budget hint; adds a budget line to the HEAVY gate." },
  { name: "context-budget", args: "[verbose]", tier: "LIGHT", tokens: "<2k", desc: "Session headroom signal (GREEN/YELLOW/RED) + drop-candidate detection." },
  { name: "create", args: "<what to build>", tier: "HEAVY", tokens: "80k–200k", desc: "Scaffold a new app — up to 5 specialists from planner through devops." },
  { name: "debug", args: "<symptom or error>", tier: "MEDIUM", tokens: "15k–40k", desc: "Systematic root-cause investigation and fix." },
  { name: "deploy", args: "[check|staging|production|rollback]", tier: "HEAVY", tokens: "40k–100k", desc: "Pre-flight checks, deployment, post-deploy verification." },
  { name: "enhance", args: "<change to make>", tier: "HEAVY", tokens: "50k–150k", desc: "Add or update features in an existing app — scoped, minimum agents." },
  { name: "help", args: "[commands|agents|skills|<name>]", tier: "LIGHT", tokens: "<5k", desc: "Full capability index — reads CATALOG.md, no bash." },
  { name: "hookify", args: "<nl description>", tier: "LIGHT", tokens: "<2k", desc: "Natural language → hooks.json snippet (never writes the file itself)." },
  { name: "instincts", args: "[status|show|promote|clear]", tier: "LIGHT", tokens: "<2k", desc: "Project-scoped learned preferences in .hub/instincts.yaml." },
  { name: "ledger", args: "[weekly|by-agent|by-skill|roi|...]", tier: "LIGHT", tokens: "<3k", desc: "Read-only aggregations over .hub/usage.json." },
  { name: "orchestrate", args: "<task or plan>", tier: "HEAVY", tokens: "80k–250k", desc: "Coordinate ≥3 agents in a 2-phase plan→approve→implement pipeline." },
  { name: "plan", args: "<what to plan>", tier: "MEDIUM", tokens: "20k–50k", desc: "Generate docs/PLAN-<slug>.md — no code, plan file only." },
  { name: "preview", args: "[start|stop|url]", tier: "LIGHT", tokens: "<2k", desc: "Start/stop the dev server and show the local URL." },
  { name: "status", tier: "LIGHT", tokens: "<2k", desc: "Project state: stack, git, open TODOs, recent changes." },
  { name: "test", args: "[generate|run|coverage|watch]", tier: "MEDIUM", tokens: "15k–60k", desc: "`generate` = MEDIUM (writes tests); other modes = LIGHT." },
  { name: "ui-ux-pro-max", args: "<target>", tier: "HEAVY", tokens: "60k–180k", desc: "Deep UI/UX audit + redesign via frontend-specialist + 3 design skills." },
];

export type AgentGroup = {
  title: string;
  agents: { name: string; desc: string }[];
};

export const AGENT_GROUPS: AgentGroup[] = [
  {
    title: "Architects / Leads",
    agents: [
      { name: "orchestrator", desc: "Multi-agent coordinator — breaks large tasks into parallel slices." },
      { name: "project-planner", desc: "Task breakdown, dependency graphs, docs/PLAN-*.md output." },
      { name: "product-owner", desc: "Requirements, user stories, acceptance criteria, backlog." },
      { name: "product-manager", desc: "MoSCoW prioritisation, &ldquo;build the right thing on the right budget&rdquo;." },
      { name: "code-archaeologist", desc: "Legacy code reading, reverse engineering, modernisation planning." },
    ],
  },
  {
    title: "Backend · Data · Infra",
    agents: [
      { name: "backend-specialist", desc: "API routes, services, business logic (Node.js, Python/FastAPI, edge)." },
      { name: "database-architect", desc: "Schema design, migrations, query optimisation, indexing." },
      { name: "devops-engineer", desc: "Deployment, CI/CD, server management, rollbacks — high-risk ops." },
      { name: "security-auditor", desc: "OWASP 2025 audits, zero-trust, supply chain security." },
      { name: "penetration-tester", desc: "Offensive security, red team, exploit simulations (CTF / engagement)." },
      { name: "performance-optimizer", desc: "Profiling, Core Web Vitals, bundle size, runtime bottlenecks." },
    ],
  },
  {
    title: "Frontend · UX",
    agents: [
      { name: "frontend-specialist", desc: "React, Next.js, Vue, Svelte — components, state, responsive design." },
      { name: "mobile-developer", desc: "React Native, Flutter — cross-platform mobile apps and native features." },
      { name: "seo-specialist", desc: "SEO audits, Core Web Vitals, E-E-A-T, AI search (GEO) visibility." },
      { name: "game-developer", desc: "Unity, Godot, Phaser, Three.js — mechanics, multiplayer, 2D/3D." },
    ],
  },
  {
    title: "Quality · Ops",
    agents: [
      { name: "debugger", desc: "Systematic root-cause analysis — the specialist for hard bugs." },
      { name: "test-engineer", desc: "Test writing, TDD, coverage improvement." },
      { name: "qa-automation-engineer", desc: "Playwright, Cypress, E2E pipelines, regression suites." },
      { name: "documentation-writer", desc: "READMEs, API docs, changelogs — invoked only on explicit request." },
      { name: "explorer-agent", desc: "Deep codebase discovery, architectural analysis, initial audits." },
    ],
  },
];

export type SkillCategory = {
  title: string;
  desc: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Workflow & orchestration",
    desc: "The glue that makes agents coordinate sanely.",
    skills: [
      "approval-gate",
      "socratic-gate",
      "plan-writing",
      "parallel-agents",
      "intelligent-routing",
      "behavioral-modes",
      "instincts",
    ],
  },
  {
    title: "Cross-stack quality",
    desc: "What &ldquo;done&rdquo; and &ldquo;safe to ship&rdquo; actually mean.",
    skills: [
      "clean-code",
      "lint-and-validate",
      "testing-patterns",
      "tdd-workflow",
      "systematic-debugging",
      "code-review-checklist",
      "architecture",
      "documentation-templates",
    ],
  },
  {
    title: "Backend & data",
    desc: "Node, Python, FastAPI, SQL, APIs, databases.",
    skills: [
      "api-patterns",
      "fastapi-expert",
      "sqlalchemy-expert",
      "python-patterns",
      "nodejs-best-practices",
      "rust-pro",
      "database-design",
    ],
  },
  {
    title: "Frontend & design",
    desc: "React, Next.js, Tailwind, mobile, visual design.",
    skills: [
      "nextjs-react-expert",
      "tailwind-patterns",
      "frontend-design",
      "web-design-guidelines",
      "mobile-design",
      "i18n-localization",
    ],
  },
  {
    title: "Security",
    desc: "Offensive, defensive, hardening.",
    skills: ["vulnerability-scanner", "red-team-tactics"],
  },
  {
    title: "Ops & performance",
    desc: "Deployments, profiling, server hygiene.",
    skills: [
      "deployment-procedures",
      "server-management",
      "performance-profiling",
      "webapp-testing",
    ],
  },
  {
    title: "LLM & AI",
    desc: "Observability and building on top of AI runtimes.",
    skills: ["llm-observability", "mcp-builder"],
  },
  {
    title: "SEO & GEO",
    desc: "Traditional search and AI search visibility.",
    skills: ["seo-fundamentals", "geo-fundamentals"],
  },
  {
    title: "Shells & platforms",
    desc: "Terminal fluency by OS.",
    skills: ["bash-linux", "powershell-windows"],
  },
  {
    title: "Apps & games",
    desc: "Scaffolds and domain-specific work.",
    skills: ["app-builder", "game-development"],
  },
];

export function tierColor(tier: Tier) {
  switch (tier) {
    case "LIGHT":
      return "text-green-600 dark:text-green-500";
    case "MEDIUM":
      return "text-amber-600 dark:text-amber-500";
    case "HEAVY":
      return "text-red-600 dark:text-red-500";
  }
}
