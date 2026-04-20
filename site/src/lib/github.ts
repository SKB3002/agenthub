import { GITHUB_REPO } from "./utils";

const GH_API = `https://api.github.com/repos/${GITHUB_REPO}`;
const HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

// Cache for 1 hour (via Next fetch cache tags)
const FETCH_OPTS = {
  headers: HEADERS,
  next: { revalidate: 3600 },
} as const;

export type Release = {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
};

export type RepoStats = {
  stars: number;
  forks: number;
  open_issues: number;
  default_branch: string;
  updated_at: string;
};

export async function getRepoStats(): Promise<RepoStats | null> {
  try {
    const res = await fetch(GH_API, FETCH_OPTS);
    if (!res.ok) return null;
    const d = await res.json();
    return {
      stars: d.stargazers_count ?? 0,
      forks: d.forks_count ?? 0,
      open_issues: d.open_issues_count ?? 0,
      default_branch: d.default_branch ?? "main",
      updated_at: d.updated_at ?? "",
    };
  } catch {
    return null;
  }
}

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(`${GH_API}/releases?per_page=20`, FETCH_OPTS);
    if (!res.ok) return [];
    const d = (await res.json()) as Release[];
    return d.filter((r) => !r.draft);
  } catch {
    return [];
  }
}

export async function getLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(`${GH_API}/releases/latest`, FETCH_OPTS);
    if (!res.ok) return null;
    return (await res.json()) as Release;
  } catch {
    return null;
  }
}

export async function getLatestCommit(): Promise<{ sha: string; date: string; message: string } | null> {
  try {
    const res = await fetch(`${GH_API}/commits?per_page=1`, FETCH_OPTS);
    if (!res.ok) return null;
    const d = await res.json();
    if (!Array.isArray(d) || d.length === 0) return null;
    const c = d[0];
    return {
      sha: c.sha?.slice(0, 7) ?? "",
      date: c.commit?.committer?.date ?? "",
      message: c.commit?.message?.split("\n")[0] ?? "",
    };
  } catch {
    return null;
  }
}
