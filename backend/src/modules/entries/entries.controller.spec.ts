import { Test, TestingModule } from '@nestjs/testing';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { DictionaryWord } from '../../shared/services/dictionary.service';
import { Request } from 'express';

describe('EntriesController', () => {
  let controller: EntriesController;

  const mockEntriesService = {
    getEntries: jest.fn(),
    getWordDetails: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-id',
      email: 'test@example.com',
    },
  } as Request & { user: { id: string; email: string } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntriesController],
      providers: [
        {
          provide: EntriesService,
          useValue: mockEntriesService,
        },
      ],
    }).compile();

    controller = module.get<EntriesController>(EntriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEntries', () => {
    const mockResponse = {
      results: ['test1', 'test2', 'test3'],
      totalDocs: 10,
      page: 1,
      totalPages: 4,
      hasNext: true,
      hasPrev: false,
    };

    it('should return paginated words', async () => {
      mockEntriesService.getEntries.mockResolvedValueOnce(mockResponse);

      const result = await controller.getEntries({ page: 1, limit: 3 });

      expect(result).toEqual(mockResponse);
      expect(mockEntriesService.getEntries).toHaveBeenCalledWith({
        page: 1,
        limit: 3,
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

    it('should return word details', async () => {
      mockEntriesService.getWordDetails.mockResolvedValueOnce(mockWordData);

      const result = await controller.getWordDetails('test', mockRequest);

      expect(result).toEqual(mockWordData);
      expect(mockEntriesService.getWordDetails).toHaveBeenCalledWith(
        'test',
        'user-id',
      );
    });
  });

  describe('addToFavorites', () => {
    it('should add word to favorites', async () => {
      mockEntriesService.addToFavorites.mockResolvedValueOnce(undefined);

      const result = await controller.addToFavorites('test', mockRequest);

      expect(result).toEqual({ message: 'Word added to favorites' });
      expect(mockEntriesService.addToFavorites).toHaveBeenCalledWith(
        'test',
        'user-id',
      );
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove word from favorites', async () => {
      mockEntriesService.removeFromFavorites.mockResolvedValueOnce(undefined);

      const result = await controller.removeFromFavorites('test', mockRequest);

      expect(result).toEqual({ message: 'Word removed from favorites' });
      expect(mockEntriesService.removeFromFavorites).toHaveBeenCalledWith(
        'test',
        'user-id',
      );
    });
  });
});
