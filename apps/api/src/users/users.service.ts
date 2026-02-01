import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@gitrats/database";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async getStats(username: string) {
    const user = await this.findByUsername(username);
    // Return actual stats from DB
    return {
      totalCommits: user.xp, // Assuming XP correlates roughly to commits or we can query Activity
      streak: user.streak,
      level: user.level,
      xp: user.xp
    };
  }

  async getRepos(username: string) {
    await this.findByUsername(username); // Verify user exists
    // Still mocking repos as they might come from GitHub API in future
    return [];
  }

  async getLeaderboard(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const whereClause = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        orderBy: { xp: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          xp: true,
          level: true,
          streak: true,
        }
      }),
      this.prisma.user.count({ where: whereClause })
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    };
  }
}
