import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PRIVATE_KEY } from '../config';
import { UserData } from '../interface/user.interface';
import { HTTP_UNAUTHORIZED_TEXT, HTTP_NEED_TOKEN_TEXT } from '../constants/text.constant'

const JWT = require('jsonwebtoken');

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization;
  
    if (token) {
      try {
        const user = await this.verifyToken(token);
        if (user && user.id) {
          request['user'] = user;
          next();
        } else {
          throw new UnauthorizedException({ message: HTTP_UNAUTHORIZED_TEXT, statusCode: 20103 });
        }
      } catch (error) {
        throw new UnauthorizedException({ message: HTTP_UNAUTHORIZED_TEXT, statusCode: 20103 });
      }
     
    } else {
      throw new UnauthorizedException({ message: HTTP_NEED_TOKEN_TEXT, statusCode: 20103 });
    }
  }


  private verifyToken (token): Promise<UserData> {
    return new Promise((resolve, reject) => {
        try {
            const res = JWT.verify(token, PRIVATE_KEY);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    })
}
}
