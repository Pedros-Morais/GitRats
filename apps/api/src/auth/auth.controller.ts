import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Get("github")
    @UseGuards(AuthGuard("github"))
    async githubAuth() {
        // Initiates the GitHub OAuth flow
    }

    @Get("github/callback")
    @UseGuards(AuthGuard("github"))
    async githubAuthCallback(@Req() req: any, @Res() res: any) {
        const { access_token } = await this.authService.login(req.user);

        // Redirect to frontend with token
        const frontendUrl = this.configService.get<string>("FRONTEND_URL") || "http://localhost:3000";
        res.redirect(`${frontendUrl}/auth/callback?token=${access_token}`);
    }
}
