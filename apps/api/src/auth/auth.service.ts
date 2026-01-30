import { Injectable } from "@nestjs/common";
import { PrismaService } from "@gitrats/database";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateGithubUser(profile: any) {
        const { id, username, photos, _json } = profile;
        const avatar = photos?.[0]?.value || _json.avatar_url;

        const user = await this.prisma.user.upsert({
            where: { githubId: id },
            update: {
                username: username,
                avatar: avatar,
                name: profile.displayName || username,
                bio: _json.bio,
            },
            create: {
                githubId: id,
                username: username,
                avatar: avatar,
                name: profile.displayName || username,
                bio: _json.bio,
            },
        });

        return user;
    }

    async login(user: any) {
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async mockLogin() {
        const mockUser = {
            id: "mock-user-id",
            githubId: "123456",
            username: "GitRat_Tester",
            name: "Test User",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GitRat",
            bio: "Just a mock user for testing",
        };

        // Try to save to DB, but if it fails (e.g. no DB connection), just sign the token anyway
        try {
            await this.prisma.user.upsert({
                where: { githubId: mockUser.githubId },
                update: {},
                create: mockUser,
            });
        } catch (error) {
            console.warn("Database unavailable, proceeding with mock token only.");
        }

        return this.login(mockUser);
    }
}
