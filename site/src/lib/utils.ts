import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GITHUB_REPO = "SKB3002/agenthub";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const SITE_URL = "https://agenthub.vercel.app";
