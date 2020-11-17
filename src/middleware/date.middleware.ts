import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DateMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    console.log('response');
    next();


    
  }
}
