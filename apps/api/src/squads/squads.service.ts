
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@gitrats/database";

@Injectable()
export class SquadsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: { name: string; description?: string; isPrivate?: boolean }) {
        const squad = await (this.prisma as any).squad.create({
            data: {
                name: data.name,
                description: data.description,
                isPrivate: Boolean(data.isPrivate),
                members: {
                    create: {
                        userId,
                        role: 'ADMIN'
                    }
                }
            },
        });

        return squad;
    }

    async findAllPublic() {
        return (this.prisma as any).squad.findMany({
            where: { isPrivate: false },
            include: {
                _count: {
                    select: { members: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findMySquads(userId: string) {
        return (this.prisma as any).squad.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                _count: {
                    select: { members: true }
                },
                members: {
                    where: { userId },
                    select: { role: true }
                }
            }
        });
    }

    async joinWithCode(userId: string, code: string) {
        const squad = await (this.prisma as any).squad.findUnique({
            where: { inviteCode: code },
        });

        if (!squad) {
            throw new NotFoundException("Invalid invite code");
        }

        // Check if already member
        const existing = await (this.prisma as any).squadMember.findUnique({
            where: {
                userId_squadId: {
                    userId,
                    squadId: squad.id
                }
            }
        });

        if (existing) {
            throw new BadRequestException("You are already a member of this squad");
        }

        return (this.prisma as any).squadMember.create({
            data: {
                userId,
                squadId: squad.id,
                role: "MEMBER",
            },
        });
    }
    async findOne(id: string) {
        const squad = await (this.prisma as any).squad.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                                xp: true,
                                level: true,
                                streak: true
                            }
                        }
                    },
                    orderBy: {
                        user: {
                            xp: 'desc'
                        }
                    }
                },
                _count: {
                    select: { members: true }
                }
            }
        });

        if (!squad) {
            throw new NotFoundException("Squad not found");
        }

        return squad;
    }
}
