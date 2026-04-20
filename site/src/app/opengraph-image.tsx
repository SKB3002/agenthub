import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AgentHub — 20 subagents, 42 skills, 17 workflows for Claude Code & Codex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>AgentHub</div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          AI coding superpowers.
          <div
            style={{
              background: "linear-gradient(90deg, #60a5fa, #ffffff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Approval-first.
          </div>
        </div>

        <div style={{ marginTop: 40, fontSize: 28, color: "#a1a1aa", maxWidth: 900 }}>
          20 subagents · 42 skills · 17 workflows — works on both Claude Code and OpenAI Codex.
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 24,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <span>agenthub</span>
          <span>·</span>
          <span>MIT licensed</span>
          <span>·</span>
          <span>github.com/SKB3002/agenthub</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
