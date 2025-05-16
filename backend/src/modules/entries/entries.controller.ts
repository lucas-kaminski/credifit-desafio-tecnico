import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
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

  @Get('en/:word')
  @UseGuards(JwtAuthGuard)
  async getWordDetails(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ) {
    return this.entriesService.getWordDetails(word, req.user.id);
  }

  @Post('en/:word/favorite')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ) {
    await this.entriesService.addToFavorites(word, req.user.id);
    return { message: 'Word added to favorites' };
  }

  @Delete('en/:word/unfavorite')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ) {
    await this.entriesService.removeFromFavorites(word, req.user.id);
    return { message: 'Word removed from favorites' };
  }
}
