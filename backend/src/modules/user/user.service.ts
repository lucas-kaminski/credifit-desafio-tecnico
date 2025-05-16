import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { ID: userId },
      select: {
        ID: true,
        NAME: true,
        EMAIL: true,
        CREATED_AT: true,
        UPDATED_AT: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.history.findMany({
        where: { USER_ID: userId },
        select: {
          WORD: {
            select: {
              WORD: true,
            },
          },
          CREATED_AT: true,
        },
        orderBy: {
          CREATED_AT: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.history.count({
        where: { USER_ID: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      results: history.map((item) => ({
        word: item.WORD.WORD,
        created_at: item.CREATED_AT,
      })),
      totalDocs: total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getFavorites(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { USER_ID: userId },
        select: {
          WORD: {
            select: {
              WORD: true,
            },
          },
          CREATED_AT: true,
        },
        orderBy: {
          CREATED_AT: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.favorite.count({
        where: { USER_ID: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      results: favorites.map((item) => ({
        word: item.WORD.WORD,
        created_at: item.CREATED_AT,
      })),
      totalDocs: total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
