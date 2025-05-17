import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { BadRequestException } from '../exceptions';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
}

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
} & Partial<Response>;

type MockRequest = {
  url: string;
  method: string;
} & Partial<Request>;

const createTimestampMatcher = () => {
  return expect.stringMatching(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
  ) as unknown as string;
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: MockResponse;
  let mockRequest: MockRequest;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test',
      method: 'GET',
    };
  });

  it('should handle custom exceptions', () => {
    const exception = new BadRequestException('Test error');
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: createTimestampMatcher(),
      path: '/test',
      method: 'GET',
      message: 'Test error',
    } as ErrorResponse);
  });

  it('should handle standard HttpExceptions', () => {
    const exception = new HttpException(
      'Standard error',
      HttpStatus.BAD_REQUEST,
    );
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: createTimestampMatcher(),
      path: '/test',
      method: 'GET',
      message: 'Standard error',
    } as ErrorResponse);
  });
});
