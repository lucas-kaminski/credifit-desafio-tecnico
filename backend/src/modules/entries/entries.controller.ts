import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EntriesService } from './entries.service';
import { GetEntriesDto } from './dto/get-entries.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get('en')
  async getEntries(@Query() query: GetEntriesDto) {
    return this.entriesService.getEntries(query);
  }

  @Get('en/word')
  @UseGuards(JwtAuthGuard)
  async getWordDetails(
    @Query('word') word: string,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const decodedWord = decodeURIComponent(word);
    const details = await this.entriesService.getWordDetails(
      decodedWord,
      req.user.id,
    );

    const { _cache, ...wordDetails } = details;
    if (_cache) {
      res.setHeader('x-cache', _cache.status);
    }
    return wordDetails;
  }

  @Post('en/word/favorite')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Query('word') word: string,
    @Req() req: RequestWithUser,
  ) {
    const decodedWord = decodeURIComponent(word);
    await this.entriesService.addToFavorites(decodedWord, req.user.id);
    return { message: 'Word added to favorites' };
  }

  @Delete('en/word/unfavorite')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Query('word') word: string,
    @Req() req: RequestWithUser,
  ) {
    const decodedWord = decodeURIComponent(word);
    await this.entriesService.removeFromFavorites(decodedWord, req.user.id);
    return { message: 'Word removed from favorites' };
  }
}
