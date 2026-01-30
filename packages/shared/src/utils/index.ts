import type { ContributionLevel } from "../types";

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format a large number with abbreviations (1K, 1M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Get contribution level (0-4) based on count
 */
export function getContributionLevel(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return formatDate(dateString);
}

/**
 * Generate a color for a contribution level
 */
export function getContributionColor(level: ContributionLevel): string {
  const colors: Record<ContributionLevel, string> = {
    0: "#161b22",
    1: "#0e4429",
    2: "#006d32",
    3: "#26a641",
    4: "#39d353",
  };
  return colors[level];
}

/**
 * Calculate streak from contribution data
 */
export function calculateStreak(
  contributions: { date: string; count: number }[]
): number {
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  // Sort by date descending
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const day of sorted) {
    if (day.count > 0) {
      streak++;
    } else if (day.date !== today) {
      break;
    }
  }

  return streak;
}
