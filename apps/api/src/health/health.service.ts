import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      stats: {
        commits: 12847,
        repos: 42,
        contributions: 1337,
      },
    };
  }
}
