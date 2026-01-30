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
}
