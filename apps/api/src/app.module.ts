import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { UsersModule } from "./users/users.module";
import { GithubModule } from "./github/github.module";
import { AuthModule } from "./auth/auth.module";
import { SquadsModule } from "./squads/squads.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    HealthModule,
    UsersModule,
    GithubModule,
    AuthModule,
    SquadsModule,
  ],
})
export class AppModule { }
