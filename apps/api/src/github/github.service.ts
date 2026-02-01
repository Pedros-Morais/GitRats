import { Injectable } from "@nestjs/common";
import { PrismaService } from "@gitrats/database";


@Injectable()
export class GithubService {
  constructor(private prisma: PrismaService) { }

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
            xp: { increment: Math.floor(Math.random() * 50) + 10 }, // Simulate "new" XP for demo purposes since we don't track processed IDs yet
            streak: streak > 0 ? streak : user.streak, // Keep max streak logic or current? Let's use calculated.
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

  async getContributions(username: string, year: number) {
    // Trigger a sync in background when profile is viewed
    this.fetchAndSyncUserActivity(username);

    // TODO: Implement GitHub GraphQL API call
    // For now, return mock contribution data
    const days = this.generateMockContributions(year);

    return {
      username,
      year,
      totalContributions: days.reduce((sum, d) => sum + d.count, 0),
      weeks: this.groupByWeeks(days),
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

  private generateMockContributions(year: number) {
    const days: { date: string; count: number }[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push({
        date: d.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 15),
      });
    }

    return days;
  }

  private groupByWeeks(days: { date: string; count: number }[]) {
    const weeks: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    days.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }
}
