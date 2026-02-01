import { Controller, Get, Param, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("leaderboard")
  @ApiOperation({ summary: "Get global leaderboard" })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  getLeaderboard(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.getLeaderboard(page, limit, search);
  }

  @Get(":username")
  @ApiOperation({ summary: "Get user profile by GitHub username" })
  @ApiParam({ name: "username", description: "GitHub username" })
  @ApiResponse({ status: 200, description: "User profile" })
  @ApiResponse({ status: 404, description: "User not found" })
  getUser(@Param("username") username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(":username/stats")
  @ApiOperation({ summary: "Get user contribution stats" })
  @ApiParam({ name: "username", description: "GitHub username" })
  getUserStats(@Param("username") username: string) {
    return this.usersService.getStats(username);
  }

  @Get(":username/repos")
  @ApiOperation({ summary: "Get user repositories" })
  @ApiParam({ name: "username", description: "GitHub username" })
  getUserRepos(@Param("username") username: string) {
    return this.usersService.getRepos(username);
  }
}
