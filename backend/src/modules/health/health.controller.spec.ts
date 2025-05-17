import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import {
  BadRequestException,
  NotFoundException,
} from '../../shared/exceptions';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return the challenge message', () => {
      const result = controller.getHealth();
      expect(result).toEqual({
        message: 'Fullstack Challenge 🏅 - Dictionary',
      });
    });
  });

  describe('getErrorExamples', () => {
    it('should throw BadRequestException when type is bad-request', () => {
      expect(() => controller.getErrorExamples('bad-request')).toThrow(
        BadRequestException,
      );
      expect(() => controller.getErrorExamples('bad-request')).toThrow(
        'This is a bad request example',
      );
    });

    it('should throw NotFoundException when type is not-found', () => {
      expect(() => controller.getErrorExamples('not-found')).toThrow(
        NotFoundException,
      );
      expect(() => controller.getErrorExamples('not-found')).toThrow(
        'This is a not found example',
      );
    });

    it('should throw Error when type is not specified', () => {
      expect(() => controller.getErrorExamples('')).toThrow(Error);
      expect(() => controller.getErrorExamples('')).toThrow(
        'This is an unhandled error example',
      );
    });
  });
});
