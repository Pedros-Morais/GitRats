const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ServerData {
  status: string;
  stats?: {
    commits: number;
    repos: number;
    contributions: number;
  };
}

export async function fetchServerData(): Promise<ServerData> {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();
    return {
      status: "ok",
      stats: data.stats || {
        commits: 12847,
        repos: 42,
        contributions: 1337,
      },
    };
  } catch {
    // Return mock data if API is not available
    return {
      status: "offline",
      stats: {
        commits: 12847,
        repos: 42,
        contributions: 1337,
      },
    };
  }
}

export async function fetchUser(username: string) {
  const res = await fetch(`${API_URL}/api/users/${username}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export async function fetchRepos(username: string) {
  const res = await fetch(`${API_URL}/api/users/${username}/repos`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch repos");
  }

  return res.json();
}
