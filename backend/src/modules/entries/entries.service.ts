import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { GetEntriesDto } from './dto/get-entries.dto';
import { Prisma } from '@prisma/client';
import {
  DictionaryService,
  DictionaryWord,
} from '../../shared/services/dictionary.service';

@Injectable()
export class EntriesService {
  constructor(
    private prisma: PrismaService,
    private dictionaryService: DictionaryService,
  ) {}

  async getEntries(query: GetEntriesDto) {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.WordWhereInput = search
      ? {
          WORD: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const [words, total] = await Promise.all([
      this.prisma.word.findMany({
        where,
        skip,
        take: limit,
        orderBy: { WORD: 'asc' },
        select: { WORD: true },
      }),
      this.prisma.word.count({ where }),
    ]);

    return {
      results: words.map((w) => w.WORD),
      totalDocs: total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    };
  }

  async getWordDetails(word: string, userId: string): Promise<DictionaryWord> {
    const wordData = await this.dictionaryService.getWord(word);

    await this.prisma.history.create({
      data: {
        USER_ID: userId,
        WORD_ID: (
          await this.prisma.word.upsert({
            where: { WORD: word },
            create: { WORD: word },
            update: {},
          })
        ).ID,
      },
    });

    return wordData;
  }

  async addToFavorites(word: string, userId: string) {
    const wordRecord = await this.prisma.word.upsert({
      where: { WORD: word },
      create: { WORD: word },
      update: {},
    });

    await this.prisma.favorite.create({
      data: {
        USER_ID: userId,
        WORD_ID: wordRecord.ID,
      },
    });
  }

  async removeFromFavorites(word: string, userId: string) {
    const wordRecord = await this.prisma.word.findUnique({
      where: { WORD: word },
    });

    if (!wordRecord) {
      throw new NotFoundException(`Word "${word}" not found`);
    }

    await this.prisma.favorite.delete({
      where: {
        USER_ID_WORD_ID: {
          USER_ID: userId,
          WORD_ID: wordRecord.ID,
        },
      },
    });
  }
}
