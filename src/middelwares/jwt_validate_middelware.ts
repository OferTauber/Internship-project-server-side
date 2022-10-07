import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getUserFromDB } from 'src/utils/mogo';

import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/utils/EnvironmentVariables';

@Injectable()
export class JwtValidateMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req?.headers?.authorization;
      if (!bearerToken) throw new UnauthorizedException();

      const [_, token] = bearerToken.split(' ');
      if (!(token && jwt.verify(token, jwtSecret)))
        throw new UnauthorizedException();

      const { email }: any = jwt.decode(token);
      if (!email) throw new UnauthorizedException();

      const user = await getUserFromDB(email);

      if (!user?.tokens?.find((userToken: string) => userToken === token))
        throw new UnauthorizedException();

      if (!user.isActive) throw new UnauthorizedException();

      res['user'] = user;

      next();
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(err);
    }
  }
}
