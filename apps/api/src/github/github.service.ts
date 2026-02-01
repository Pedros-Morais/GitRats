import { Injectable } from "@nestjs/common";
import { PrismaService } from "@gitrats/database";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) { }

  async fetchAndSyncUserActivity(username: string) {
    try {
      // 1. Fetch public events from GitHub
      const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);

      if (!response.ok) {
        console.error(`Failed to fetch GitHub events for ${username}: ${response.statusText}`);
        return;
      }

      const events = await response.json() as any[];

      // 2. Process events and calculate XP
      let newXp = 0;
      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const activityDates = new Set<string>();

      for (const event of events) {
        const date = event.created_at.split('T')[0];
        activityDates.add(date);

        // Calculate XP based on event type
        let xp = 0;
        switch (event.type) {
          case 'PushEvent':
            xp = (event.payload.size || 1) * 5; // 5 XP per commit
            break;
          case 'PullRequestEvent':
            xp = event.payload.action === 'opened' ? 20 : 0;
            break;
          case 'IssuesEvent':
            xp = event.payload.action === 'opened' ? 10 : 0;
            break;
          case 'CreateEvent':
            xp = 5;
            break;
          default:
            xp = 1;
        }
        newXp += xp;

        // Skip if we already recorded this specific event ID to avoid infinite XP glitch
        // In a real app, we'd check DB for this event ID. 
        // For MVP, we'll just aggregate total XP from the last 100 events and update user.
        // A better approach is to store the "lastSyncedEventId".
      }

      // Simple Streak Calculation (consecutive days looking back)
      let currentCheck = new Date();
      while (true) {
        const dateStr = currentCheck.toISOString().split('T')[0];
        if (activityDates.has(dateStr)) {
          streak++;
          currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
          // Allow missing today if it's still early? No, strict streak.
          // If today is missing, check yesterday.
          if (dateStr === today && streak === 0) {
            currentCheck.setDate(currentCheck.getDate() - 1);
            continue;
          }
          break;
        }
      }

      // 3. Update User in DB
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (user) {
        // We add new XP to existing? Or replace? 
        // Since we fetch "latest 100 events", this is a sliding window. 
        // Real implementation should be incremental. 
        // For MVP, let's just use this derived XP as the "Recent Active XP" + base.
        // Or simpler: Just update the stats based on what we see now.

        await this.prisma.user.update({
          where: { username },
          data: {
            // xp: { increment: Math.floor(newXp / 10) }, // TODO: Implement robust event deduplication to use real XP
            streak: streak > 0 ? streak : user.streak,
            updatedAt: new Date()
          }
        });

        // Also log the latest activity
        if (events.length > 0) {
          const latest = events[0];
          await this.prisma.activity.create({
            data: {
              type: latest.type,
              repo: latest.repo.name,
              userId: user.id,
              date: new Date(latest.created_at),
              xpEarned: 10 // Arbitrary for the log
            }
          });
        }
      }

      return { eventsCount: events.length, newXp };

    } catch (error) {
      console.error("Sync Error:", error);
      return null;
    }
  }

  async getContributions(username: string, year: number = new Date().getFullYear()) {
    this.fetchAndSyncUserActivity(username).catch(err => console.error("Sync failed", err));

    // Priority 1: User's stored token (if they logged in via GitHub)
    const user = await this.prisma.user.findUnique({ where: { username } });
    let token = user?.githubAccessToken;

    // Priority 2: Global token (fallback for testing/public data)
    if (!token) {
      token = this.configService.get("GITHUB_TOKEN");
    }

    if (token) {
      try {
        const query = `
              query($username: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $username) {
                  contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          color
                          contributionCount
                          date
                        }
                      }
                    }
                  }
                }
              }
            `;

        const from = `${year}-01-01T00:00:00Z`;
        const to = `${year}-12-31T23:59:59Z`;

        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { username, from, to }
          })
        });

        const data = await res.json() as any;

        if (data.errors) {
          console.error("GitHub GraphQL Errors:", JSON.stringify(data.errors, null, 2));
        }

        const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

        if (calendar) {
          return {
            username,
            year,
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks.map((w: any) => w.contributionDays)
          }
        }
        console.warn("GraphQL Data missing:", data);
      } catch (error) {
        console.error("GraphQL Error:", error);
      }
    }


    // Fallback if no token or error: Return empty data, do NOT generate mocks.
    return {
      username,
      year,
      totalContributions: 0,
      weeks: [],
    };
  }

  async getRecentActivity(username: string, limit: number) {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=${limit}`);
    const events = await response.json() as any[];

    if (!Array.isArray(events)) return { username, activities: [] };

    return {
      username,
      activities: events.map((e: any) => ({
        id: e.id,
        type: e.type,
        repo: e.repo.name,
        message: e.payload?.commits?.[0]?.message || e.type,
        createdAt: e.created_at
      }))
    };
  }

  async getDailyQuests(username: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return { quests: [] };

    // Query today's activities for this user
    const todayActivities = await this.prisma.activity.findMany({
      where: {
        userId: user.id,
        date: { gte: today }
      }
    });

    const pushCount = todayActivities.filter(a => a.type === 'PushEvent').length;
    const prCount = todayActivities.filter(a => a.type === 'PullRequestEvent').length;
    const xpEarnedToday = todayActivities.reduce((sum, a) => sum + a.xpEarned, 0);

    return {
      quests: [
        { title: "Push 1 Commit", progress: pushCount >= 1 ? 100 : 0, complete: pushCount >= 1 },
        { title: "Open/Merge a PR", progress: prCount >= 1 ? 100 : 0, complete: prCount >= 1 },
        { title: "Earn 50 XP", progress: Math.min(100, (xpEarnedToday / 50) * 100), complete: xpEarnedToday >= 50 }
      ]
    };
  }
}
