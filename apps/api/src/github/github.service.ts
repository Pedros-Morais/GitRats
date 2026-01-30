import { Injectable } from "@nestjs/common";


@Injectable()
export class GithubService {
  constructor() { }

  async getContributions(username: string, year: number) {
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
    // TODO: Implement GitHub Events API call
    // For now, return mock activity

    return {
      username,
      activities: [
        {
          id: "1",
          type: "PushEvent",
          repo: "gitrats",
          message: "feat: add contribution graph",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          type: "PullRequestEvent",
          repo: "gitrats",
          message: "Merge PR #42: Add dark mode",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "3",
          type: "IssuesEvent",
          repo: "cluemed",
          message: "Opened issue: Add export feature",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ].slice(0, limit),
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
