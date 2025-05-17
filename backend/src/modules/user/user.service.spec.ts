import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    history: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    favorite: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    const mockUser = {
      ID: 'user-id',
      NAME: 'Test User',
      EMAIL: 'test@example.com',
      CREATED_AT: new Date(),
      UPDATED_AT: new Date(),
    };

    it('should return user profile', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.getProfile('user-id');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { ID: 'user-id' },
        select: {
          ID: true,
          NAME: true,
          EMAIL: true,
          CREATED_AT: true,
          UPDATED_AT: true,
        },
      });
    });

    it('should throw error when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getHistory', () => {
    const mockHistory = [
      {
        WORD: { WORD: 'test1' },
        CREATED_AT: new Date(),
      },
      {
        WORD: { WORD: 'test2' },
        CREATED_AT: new Date(),
      },
    ];

    it('should return paginated history', async () => {
      mockPrismaService.history.findMany.mockResolvedValueOnce(mockHistory);
      mockPrismaService.history.count.mockResolvedValueOnce(10);

      const result = await service.getHistory('user-id', 1, 2);

      expect(result).toEqual({
        results: mockHistory.map((item) => ({
          word: item.WORD.WORD,
          created_at: item.CREATED_AT,
        })),
        totalDocs: 10,
        page: 1,
        totalPages: 5,
        hasNext: true,
        hasPrev: false,
      });
    });
  });

  describe('getFavorites', () => {
    const mockFavorites = [
      {
        WORD: { WORD: 'test1' },
        CREATED_AT: new Date(),
      },
      {
        WORD: { WORD: 'test2' },
        CREATED_AT: new Date(),
      },
    ];

    it('should return paginated favorites', async () => {
      mockPrismaService.favorite.findMany.mockResolvedValueOnce(mockFavorites);
      mockPrismaService.favorite.count.mockResolvedValueOnce(10);

      const result = await service.getFavorites('user-id', 1, 2);

      expect(result).toEqual({
        results: mockFavorites.map((item) => ({
          word: item.WORD.WORD,
          created_at: item.CREATED_AT,
        })),
        totalDocs: 10,
        page: 1,
        totalPages: 5,
        hasNext: true,
        hasPrev: false,
      });
    });
  });
});
