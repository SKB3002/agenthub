import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AgentHub — 20 subagents, 42 skills, 17 workflows for Claude Code & Codex",
    template: "%s · AgentHub",
  },
  description:
    "AgentHub gives your AI coding sessions an instant upgrade: domain-expert subagents, on-demand skills, and approval-first workflows. Works on Claude Code and OpenAI Codex.",
  keywords: [
    "claude code",
    "openai codex",
    "ai agents",
    "subagents",
    "skills",
    "developer tools",
    "plugin",
    "agenthub",
  ],
  authors: [{ name: "Suyash Bhatkar", url: "https://github.com/SKB3002" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "AgentHub — AI coding superpowers, approval-first",
    description:
      "20 subagents · 42 skills · 17 workflows. One repo. Works on both Claude Code and OpenAI Codex.",
    siteName: "AgentHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentHub",
    description: "20 subagents · 42 skills · 17 workflows for Claude Code and Codex.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
