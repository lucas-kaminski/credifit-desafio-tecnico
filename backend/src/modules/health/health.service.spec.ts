import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  describe('getHealth', () => {
    it('should return the challenge message', () => {
      const result = service.getHealth();
      expect(result).toEqual({
        message: 'Fullstack Challenge 🏅 - Dictionary',
      });
    });
  });
});
