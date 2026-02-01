import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "./strategies/github.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PrismaModule } from "@gitrats/database";

@Module({
    imports: [
        PassportModule,
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: { expiresIn: "7d" },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GithubStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
