import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type EndFunction = {
  (cb?: () => void): Response;
  (chunk: unknown, cb?: () => void): Response;
  (chunk: unknown, encoding?: BufferEncoding, cb?: () => void): Response;
};

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();

    const originalEnd = res.end.bind(res) as EndFunction;
    res.end = function (
      this: Response,
      chunk?: unknown,
      encoding?: BufferEncoding | (() => void),
      callback?: () => void,
    ): Response {
      const responseTime = Date.now() - startTime;
      res.setHeader('x-response-time', `${responseTime}ms`);

      if (typeof encoding === 'function') {
        return originalEnd(chunk, undefined, encoding);
      }
      if (typeof encoding === 'string') {
        return originalEnd(chunk, encoding, callback);
      }
      return originalEnd(chunk, undefined, callback);
    } as EndFunction;

    next();
  }
}
