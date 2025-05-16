import { Test, TestingModule } from '@nestjs/testing';
import { EntriesService } from './entries.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { NotFoundException } from '@nestjs/common';
import { DictionaryWord } from '../../shared/services/dictionary.service';

describe('EntriesService', () => {
  let service: EntriesService;
  let prismaService: PrismaService;
  let dictionaryService: DictionaryService;

  const mockPrismaService = {
    word: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    history: {
      create: jest.fn(),
    },
    favorite: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDictionaryService = {
    getWord: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: DictionaryService,
          useValue: mockDictionaryService,
        },
      ],
    }).compile();

    service = module.get<EntriesService>(EntriesService);
    prismaService = module.get<PrismaService>(PrismaService);
    dictionaryService = module.get<DictionaryService>(DictionaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEntries', () => {
    const mockWords = [{ WORD: 'test1' }, { WORD: 'test2' }, { WORD: 'test3' }];

    it('should return paginated words without search', async () => {
      mockPrismaService.word.findMany.mockResolvedValueOnce(mockWords);
      mockPrismaService.word.count.mockResolvedValueOnce(10);

      const result = await service.getEntries({ page: 1, limit: 3 });

      expect(result).toEqual({
        results: ['test1', 'test2', 'test3'],
        totalDocs: 10,
        page: 1,
        totalPages: 4,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should return filtered words with search', async () => {
      mockPrismaService.word.findMany.mockResolvedValueOnce([{ WORD: 'test' }]);
      mockPrismaService.word.count.mockResolvedValueOnce(1);

      const result = await service.getEntries({
        search: 'test',
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        results: ['test'],
        totalDocs: 1,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('getWordDetails', () => {
    const mockWordData: DictionaryWord = {
      word: 'test',
      phonetics: [],
      meanings: [],
      license: { name: '', url: '' },
      sourceUrls: [],
    };

    it('should return word details and record history', async () => {
      mockDictionaryService.getWord.mockResolvedValueOnce(mockWordData);
      mockPrismaService.word.upsert.mockResolvedValueOnce({ ID: 'word-id' });
      mockPrismaService.history.create.mockResolvedValueOnce({});

      const result = await service.getWordDetails('test', 'user-id');

      expect(result).toEqual(mockWordData);
      expect(mockPrismaService.history.create).toHaveBeenCalledWith({
        data: {
          USER_ID: 'user-id',
          WORD_ID: 'word-id',
        },
      });
    });

    it('should throw NotFoundException when word is not found', async () => {
      mockDictionaryService.getWord.mockRejectedValueOnce(
        new NotFoundException('Word not found'),
      );

      await expect(
        service.getWordDetails('nonexistent', 'user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToFavorites', () => {
    it('should add word to favorites', async () => {
      mockPrismaService.word.upsert.mockResolvedValueOnce({ ID: 'word-id' });
      mockPrismaService.favorite.create.mockResolvedValueOnce({});

      await service.addToFavorites('test', 'user-id');

      expect(mockPrismaService.favorite.create).toHaveBeenCalledWith({
        data: {
          USER_ID: 'user-id',
          WORD_ID: 'word-id',
        },
      });
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove word from favorites', async () => {
      mockPrismaService.word.findUnique.mockResolvedValueOnce({
        ID: 'word-id',
      });
      mockPrismaService.favorite.delete.mockResolvedValueOnce({});

      await service.removeFromFavorites('test', 'user-id');

      expect(mockPrismaService.favorite.delete).toHaveBeenCalledWith({
        where: {
          USER_ID_WORD_ID: {
            USER_ID: 'user-id',
            WORD_ID: 'word-id',
          },
        },
      });
    });

    it('should throw NotFoundException when word is not found', async () => {
      mockPrismaService.word.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.removeFromFavorites('nonexistent', 'user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
