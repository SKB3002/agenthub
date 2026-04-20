import type { Metadata } from "next";
import { getReleases } from "@/lib/github";
import { GITHUB_URL } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every AgentHub release, pulled live from GitHub. Updates automatically — no redeploy needed.",
};

export const revalidate = 3600;

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// Render simple markdown inline (bold, code, links, lists) without pulling a heavy parser
function renderBody(body: string) {
  const lines = body.split(/\r?\n/);
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    out.push(
      <ul key={out.length} className="my-3 list-disc space-y-1 pl-5 text-foreground/85">
        {listBuffer.map((l, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(l) }} />
        ))}
      </ul>
    );
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.slice(2));
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      out.push(
        <h4 key={out.length} className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {trimmed.slice(4)}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      out.push(
        <h3 key={out.length} className="mt-5 text-base font-semibold">
          {trimmed.slice(3)}
        </h3>
      );
      continue;
    }
    flushList();
    out.push(
      <p
        key={out.length}
        className="my-2 text-foreground/85"
        dangerouslySetInnerHTML={{ __html: inlineMd(trimmed) }}
      />
    );
  }
  flushList();
  return out;
}

function inlineMd(s: string) {
  // Escape HTML first
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-[var(--muted)] px-1 py-0.5 font-mono text-[0.85em] border border-[var(--border)]">$1</code>');
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // links
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--brand)] underline underline-offset-2">$1</a>'
  );
  return s;
}

export default async function ChangelogPage() {
  const releases = await getReleases();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
        <p className="mt-3 text-muted-foreground">
          Every AgentHub release, pulled live from GitHub. Cached for 1 hour — cut a release on
          GitHub and it shows up here automatically, no redeploy needed.
        </p>
      </header>

      {releases.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          No releases yet. Watch the repo on GitHub to be notified:{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {GITHUB_URL.replace("https://", "")}
          </a>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {releases.map((r) => (
            <article key={r.tag_name} id={r.tag_name} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-brand"
                  >
                    {r.name || r.tag_name}
                    <ExternalLink className="h-4 w-4 opacity-50" />
                  </a>
                </h2>
                {r.prerelease ? (
                  <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    pre-release
                  </span>
                ) : null}
                <time className="ml-auto text-sm text-muted-foreground">
                  {formatDate(r.published_at)}
                </time>
              </div>

              <div className="mt-4 text-sm leading-relaxed">
                {r.body?.trim() ? renderBody(r.body) : (
                  <p className="text-muted-foreground">No release notes.</p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <code className="rounded bg-muted px-2 py-0.5 font-mono">{r.tag_name}</code>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  View on GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
