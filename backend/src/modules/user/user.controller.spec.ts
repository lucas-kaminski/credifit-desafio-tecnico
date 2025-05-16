import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getProfile: jest.fn(),
    getHistory: jest.fn(),
    getFavorites: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-id',
      email: 'test@example.com',
    },
  } as Request & { user: { id: string; email: string } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    const mockProfile = {
      ID: 'user-id',
      NAME: 'Test User',
      EMAIL: 'test@example.com',
      CREATED_AT: new Date(),
      UPDATED_AT: new Date(),
    };

    it('should return user profile', async () => {
      mockUserService.getProfile.mockResolvedValueOnce(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(mockUserService.getProfile).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getHistory', () => {
    const mockHistory = {
      results: [
        {
          word: 'test1',
          created_at: new Date(),
        },
        {
          word: 'test2',
          created_at: new Date(),
        },
      ],
      totalDocs: 10,
      page: 1,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    };

    it('should return paginated history', async () => {
      mockUserService.getHistory.mockResolvedValueOnce(mockHistory);

      const result = await controller.getHistory(mockRequest, '1', '10');

      expect(result).toEqual(mockHistory);
      expect(mockUserService.getHistory).toHaveBeenCalledWith('user-id', 1, 10);
    });

    it('should use default pagination values', async () => {
      mockUserService.getHistory.mockResolvedValueOnce(mockHistory);

      await controller.getHistory(mockRequest);

      expect(mockUserService.getHistory).toHaveBeenCalledWith('user-id', 1, 10);
    });
  });

  describe('getFavorites', () => {
    const mockFavorites = {
      results: [
        {
          word: 'test1',
          created_at: new Date(),
        },
        {
          word: 'test2',
          created_at: new Date(),
        },
      ],
      totalDocs: 10,
      page: 1,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    };

    it('should return paginated favorites', async () => {
      mockUserService.getFavorites.mockResolvedValueOnce(mockFavorites);

      const result = await controller.getFavorites(mockRequest, '1', '10');

      expect(result).toEqual(mockFavorites);
      expect(mockUserService.getFavorites).toHaveBeenCalledWith(
        'user-id',
        1,
        10,
      );
    });

    it('should use default pagination values', async () => {
      mockUserService.getFavorites.mockResolvedValueOnce(mockFavorites);

      await controller.getFavorites(mockRequest);

      expect(mockUserService.getFavorites).toHaveBeenCalledWith(
        'user-id',
        1,
        10,
      );
    });
  });
});
