import { Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { RedisService } from './redis.service';

export interface DictionaryWord {
  word: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
    synonyms: string[];
    antonyms: string[];
  }>;
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
  _cache?: {
    status: 'HIT' | 'MISS';
    responseTime: number;
  };
}

@Injectable()
export class DictionaryService {
  private readonly API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  private readonly CACHE_TTL = 60 * 60 * 24;

  constructor(private readonly redisService: RedisService) {}

  async getWord(word: string): Promise<DictionaryWord> {
    const cacheKey = `word:${word}`;
    const startTime = Date.now();
    let cacheStatus = 'MISS';

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        cacheStatus = 'HIT';
        const responseTime = Date.now() - startTime;
        const result = JSON.parse(cachedData) as DictionaryWord;
        return {
          ...result,
          _cache: {
            status: cacheStatus as 'HIT' | 'MISS',
            responseTime,
          },
        };
      }

      const response = await axios.get<DictionaryWord[]>(
        `${this.API_URL}/${encodeURIComponent(word)}`,
      );

      if (!response.data.length) {
        throw new NotFoundException(`Word "${word}" not found at API`);
      }

      await this.redisService.set(
        cacheKey,
        JSON.stringify(response.data[0]),
        this.CACHE_TTL,
      );

      const responseTime = Date.now() - startTime;
      return {
        ...response.data[0],
        _cache: {
          status: cacheStatus as 'HIT' | 'MISS',
          responseTime,
        },
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundException(`Word "${word}" not found at API`);
      }
      throw error;
    }
  }
}
