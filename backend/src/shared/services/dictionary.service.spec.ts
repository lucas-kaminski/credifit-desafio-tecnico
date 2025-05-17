import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryService, DictionaryWord } from './dictionary.service';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { NotFoundException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DictionaryService', () => {
  let service: DictionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionaryService],
    }).compile();

    service = module.get<DictionaryService>(DictionaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWord', () => {
    const mockWord: DictionaryWord = {
      word: 'test',
      phonetics: [
        {
          text: '/test/',
          audio: 'https://example.com/test.mp3',
        },
      ],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A procedure for critical evaluation',
              example: 'This is a test',
              synonyms: ['trial'],
              antonyms: [],
            },
          ],
          synonyms: ['trial'],
          antonyms: [],
        },
      ],
      license: {
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0',
      },
      sourceUrls: ['https://example.com/test'],
    };

    it('should return word data when word exists', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockWord] });

      const result = await service.getWord('test');

      expect(result).toEqual(mockWord);
      const getSpy = jest.spyOn(mockedAxios, 'get');
      expect(getSpy).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/api/v2/entries/en/test',
      );
    });

    it('should throw NotFoundException when word does not exist', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await expect(service.getWord('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when API returns 404', async () => {
      const error = new AxiosError(
        'Not Found',
        '404',
        {} as InternalAxiosRequestConfig,
        {},
        {
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
          data: {},
        },
      );
      error.response = {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {},
      };
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(service.getWord('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw original error when API returns other errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(service.getWord('test')).rejects.toThrow(error);
    });
  });
});
