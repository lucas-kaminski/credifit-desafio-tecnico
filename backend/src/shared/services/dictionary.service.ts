import { Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

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
}

@Injectable()
export class DictionaryService {
  private readonly API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async getWord(word: string): Promise<DictionaryWord> {
    try {
      const response = await axios.get<DictionaryWord[]>(
        `${this.API_URL}/${word}`,
      );
      const wordData = response.data[0];

      if (!wordData) {
        throw new NotFoundException(`Word "${word}" not found`);
      }

      return wordData;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundException(`Word "${word}" not found`);
      }
      throw error;
    }
  }
}
