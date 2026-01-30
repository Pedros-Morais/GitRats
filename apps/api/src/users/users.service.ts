import { Injectable, NotFoundException } from "@nestjs/common";

// Mock data - replace with database/GitHub API
const mockUsers: Record<string, any> = {
  pedromorais: {
    id: "1",
    username: "pedromorais",
    name: "Pedro Morais",
    avatar: "https://github.com/pedromorais.png",
    bio: "Full-stack developer",
    location: "Brazil",
    createdAt: "2020-01-01",
    stats: {
      totalCommits: 12847,
      totalRepos: 42,
      contributions: 1337,
      streak: 365,
      languages: ["TypeScript", "Python", "Go"],
    },
  },
};

@Injectable()
export class UsersService {
  async findByUsername(username: string) {
    const user = mockUsers[username.toLowerCase()];
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async getStats(username: string) {
    const user = await this.findByUsername(username);
    return user.stats;
  }

  async getRepos(username: string) {
    await this.findByUsername(username); // Verify user exists

    // Mock repos - replace with GitHub API call
    return [
      {
        id: "1",
        name: "gitrats",
        description: "GitHub contribution tracker",
        language: "TypeScript",
        stars: 128,
        forks: 23,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "cluemed",
        description: "Healthcare document management",
        language: "TypeScript",
        stars: 45,
        forks: 8,
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
