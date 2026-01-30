
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(
        configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>("GITHUB_CLIENT_ID") || "PLACEHOLDER",
            clientSecret:
                configService.get<string>("GITHUB_CLIENT_SECRET") || "PLACEHOLDER",
            callbackURL:
                configService.get<string>("GITHUB_CALLBACK_URL") ||
                "http://localhost:4000/api/auth/github/callback",
            scope: ["public_profile", "read:user", "user:email"],
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
        return this.authService.validateGithubUser(profile);
    }
}
