// User types
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
  createdAt: string;
  stats: UserStats;
}

export interface UserStats {
  totalCommits: number;
  totalRepos: number;
  contributions: number;
  streak: number;
  languages: string[];
}

// Repository types
export interface Repository {
  id: string;
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url?: string;
}

// Contribution types
export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionGraph {
  username: string;
  year: number;
  totalContributions: number;
  weeks: ContributionWeek[];
}

// Activity types
export interface Activity {
  id: string;
  type: ActivityType;
  repo: string;
  message: string;
  createdAt: string;
}

export type ActivityType =
  | "PushEvent"
  | "PullRequestEvent"
  | "IssuesEvent"
  | "CreateEvent"
  | "DeleteEvent"
  | "ForkEvent"
  | "WatchEvent";

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Health check
export interface HealthCheck {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  stats?: {
    commits: number;
    repos: number;
    contributions: number;
  };
}
