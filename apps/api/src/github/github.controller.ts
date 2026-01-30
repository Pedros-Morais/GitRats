import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { GithubService } from "./github.service";

@ApiTags("github")
@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get("contributions")
  @ApiOperation({ summary: "Get contribution graph data" })
  @ApiQuery({ name: "username", required: true })
  @ApiQuery({ name: "year", required: false })
  getContributions(
    @Query("username") username: string,
    @Query("year") year?: string
  ) {
    return this.githubService.getContributions(
      username,
      year ? parseInt(year) : new Date().getFullYear()
    );
  }

  @Get("activity")
  @ApiOperation({ summary: "Get recent activity" })
  @ApiQuery({ name: "username", required: true })
  @ApiQuery({ name: "limit", required: false })
  getActivity(
    @Query("username") username: string,
    @Query("limit") limit?: string
  ) {
    return this.githubService.getRecentActivity(
      username,
      limit ? parseInt(limit) : 10
    );
  }
}
