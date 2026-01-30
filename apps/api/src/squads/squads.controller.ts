
import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SquadsService } from "./squads.service";

@Controller("squads")
export class SquadsController {
    constructor(private squadsService: SquadsService) { }

    @Get("public")
    async getPublicSquads() {
        return this.squadsService.findAllPublic();
    }

    @Get("my")
    @UseGuards(AuthGuard("jwt"))
    async getMySquads(@Req() req: any) {
        return this.squadsService.findMySquads(req.user.sub);
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createSquad(@Req() req: any, @Body() body: { name: string; description?: string; isPrivate?: boolean }) {
        return this.squadsService.create(req.user.sub, body);
    }

    @Post("join")
    @UseGuards(AuthGuard("jwt"))
    async joinSquad(@Req() req: any, @Body() body: { code: string }) {
        return this.squadsService.joinWithCode(req.user.sub, body.code);
    }
}
