import {
  Controller,
  Post,
  Headers,
  Body,
  Get,
  HttpException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import AuthCredentialsDTO from 'src/Data_transfer_objects/auth_credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() req: AuthCredentialsDTO): Promise<string> {
    const token = await this.authService.login(req);

    return token;
  }

  @Post('/logout')
  async logout(@Headers() headers): Promise<void> {
    const token = extractTokenFromHeaders(headers);
    await this.authService.logout(token);
    return;
  }

  @Post('/logout-all')
  async logoutAll(@Headers() headers): Promise<void> {
    const token = extractTokenFromHeaders(headers);
    await this.authService.logoutAllAccounts(token);
    return;
  }

  @Get('/validate-token')
  isTokenValid(@Headers() headers): boolean {
    try {
      const token = extractTokenFromHeaders(headers);
      this.authService.isTokenValid(token);

      return true;
    } catch (err) {
      return false;
    }
  }
}

const extractTokenFromHeaders = (headers: any): string => {
  try {
    const [_, token] = headers?.authorization?.split(' ');

    if (!token) throw new HttpException('Please provide a token', 403);

    return token;
  } catch (err) {
    throw new HttpException('Please provide a valid token', 403);
  }
};
