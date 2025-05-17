import { HttpStatus, ArgumentsHost } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { BadRequestException } from '../exceptions';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
}

interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

interface MockRequest extends Partial<Request> {
  url: string;
  method: string;
}

const createTimestampMatcher = () => {
  return expect.stringMatching(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
  ) as unknown as string;
};

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: MockResponse;
  let mockRequest: MockRequest;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test',
      method: 'GET',
    };
  });

  it('should handle HttpExceptions', () => {
    const exception = new BadRequestException('Test error');
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

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

  it('should handle standard Error', () => {
    const exception = new Error('Standard error');
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: createTimestampMatcher(),
      path: '/test',
      method: 'GET',
      message: 'Standard error',
    } as ErrorResponse);
  });

  it('should handle unknown errors', () => {
    const exception: unknown = 'Unknown error';
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: createTimestampMatcher(),
      path: '/test',
      method: 'GET',
      message: 'Internal server error',
    } as ErrorResponse);
  });
});
