import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "@/components/github-icon";
import { GITHUB_URL } from "@/lib/utils";

const navLinks = [
  { href: "/docs/install", label: "Install" },
  { href: "/docs/commands", label: "Commands" },
  { href: "/docs/agents", label: "Agents" },
  { href: "/docs/skills", label: "Skills" },
  { href: "/changelog", label: "Changelog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-md bg-brand" aria-hidden />
          <span>AgentHub</span>
          <span className="ml-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
            v0.4
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-sm text-foreground/70 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
