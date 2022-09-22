import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthCredentialsDTO from 'src/Data_transfer_objects/auth_credentials.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
    const user = await this.authService.validateUsersCredentials(
      authCredentialsDTO,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
