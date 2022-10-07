import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import UserDTO from 'src/Data_transfer_objects/user.dto';
import AuthCredentialsDTO from 'src/Data_transfer_objects/auth_credentials.dto';
import * as jwt from 'jsonwebtoken';
import PayloadDto from 'src/Data_transfer_objects/payload.dto';
import {
  // getUserFromDB,
  // addTokenToUser,
  // removeTokenFromUser,
  removeAllUserTokens,
} from 'src/utils/dynamoDb';
import {
  getUserFromDB,
  addTokenToUser,
  removeTokenFromUser,
} from '../../utils/mogo';
import { jwtSecret } from '../../utils/EnvironmentVariables';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUsersCredentials(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<UserDTO> {
    const { email, password } = authCredentialsDTO;
    const user = await getUserFromDB(email);
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException('Please recheck the credentials');
    }

    return user;
  }

  private async getUserFromDbByAuthCredentials(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<UserDTO> {
    const { email, password } = authCredentialsDTO;
    const user = await getUserFromDB(email);
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException('Please recheck the credentials');
    }

    return user;
  }

  async login(auth_credentials: AuthCredentialsDTO): Promise<string> {
    try {
      const user = await this.getUserFromDbByAuthCredentials(auth_credentials);

      if (!user.isActive) throw new UnauthorizedException();

      const payload: PayloadDto = { email: user.email, isAdmin: user.isAdmin };

      const accessToken = jwt.sign(payload, jwtSecret, {
        expiresIn: '2d',
      });

      await addTokenToUser(user, accessToken);

      return accessToken;
    } catch (err) {
      console.error(err);
      throw new NotFoundException();
    }
  }

  async logout(token: string): Promise<void> {
    const user = await this.getUserFromDbByToken(token);

    await removeTokenFromUser(user, token);
  }

  async logoutAllAccounts(token: string): Promise<void> {
    const payload: any = jwt.decode(token);

    await removeAllUserTokens(payload.email);
  }

  isTokenValid(token: string): boolean {
    return !!jwt.verify(token, jwtSecret);
  }

  async getPassword(str: string): Promise<string> {
    return await bcrypt.hash(str, 10);
  }

  //* ============ Privet ============
  private getUserFromDbByToken = async (token: string): Promise<UserDTO> => {
    const decoded: any = jwt.decode(token);
    if (!decoded?.email) throw new NotFoundException();

    const user = await getUserFromDB(decoded.email);
    if (!user?.email) throw new NotFoundException();

    return user;
  };
}
