import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Line =
  | { role: "user"; text: ReactNode }
  | { role: "assistant"; text: ReactNode }
  | { role: "agent"; name: string; text: ReactNode }
  | { role: "gate"; text: ReactNode }
  | { role: "system"; text: ReactNode };

export function Dialogue({ title, lines }: { title?: string; lines: Line[] }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
      {title ? (
        <div className="border-b border-border bg-muted/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      ) : null}
      <div className="divide-y divide-border">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 px-4 py-3 text-sm">
            <Pill role={line} />
            <div className="min-w-0 flex-1 text-foreground/90">
              {"text" in line ? line.text : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({ role }: { role: Line }) {
  const styles = {
    user: "border-border bg-background text-foreground/80",
    assistant: "border-brand/40 bg-brand/10 text-brand",
    agent: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-500",
    gate: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-500",
    system: "border-border bg-muted text-muted-foreground",
  } as const;

  const label =
    role.role === "agent"
      ? `hub:${role.name}`
      : role.role === "gate"
      ? "gate"
      : role.role;

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md border px-2 font-mono text-[10px] font-semibold uppercase tracking-wider",
        styles[role.role]
      )}
    >
      {label}
    </span>
  );
}
