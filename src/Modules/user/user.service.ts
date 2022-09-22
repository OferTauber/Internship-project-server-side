import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import UserDTO from 'src/Data_transfer_objects/user.dto';
import { getUserFromDB } from 'src/utils/dynamoDb';

@Injectable()
export class UserService {
  // async createUser(
  //   email: string,
  //   password: string,
  //   isAdmin: boolean,
  // ): Promise<string> {
  //   if (!(email && userName && password))
  //     throw new BadRequestException('Missing information');
  //   if (!validator.isEmail(email))
  //     throw new BadRequestException('Invalid email');
  //   if (
  //     users.find((registerdUser) => registerdUser.email.toLowerCase() === email)
  //   ) {
  //     throw new BadRequestException(
  //       'The email is already in use by a registered user',
  //     );
  //   }
  //   const hashdPassword = await bcrypt.hash(password, 10);
  //   const newUser = DB_Controllers.addUser(
  //     userName,
  //     email.toLowerCase(),
  //     hashdPassword,
  //     isAdmin,
  //   );
  //   return newUser.id;
  // }
  // async updateUser(
  //   email: string,
  //   password?: string,
  //   isAdmin?: boolean,
  // ): Promise<void> {
  //   if (!email) throw new BadRequestException('Missing information');
  //   const [user, _] = this.findUserByEmail(email);
  //   if (email) {
  //     if (validator.isEmail(email)) user.email = email.toLowerCase();
  //     throw new BadRequestException('Invalid email');
  //   }
  //   if (isAdmin || isAdmin === false) user.isAdmin = isAdmin;
  //   if (password) {
  //     const hashdPassword = await bcrypt.hash(password, 10);
  //     user.password = hashdPassword;
  //   }
  // }
  // removeUser(email: string) {
  //   const [_, userIndex] = this.findUserByEmail(email);
  //   users.splice(userIndex, 1);
  // }
  // toogleUserActivStatus(id: string, isActiv: boolean) {
  //   const [user, _] = this.findUserById(id);
  //   user.isActive = isActiv;
  // }
  // private findUserById(id: string): [UserDTO, number] {
  //   const userIndex = users.findIndex(
  //     (registerdUser) => registerdUser.id === id,
  //   );
  //   if (-1 === userIndex) throw new NotFoundException();
  //   return [users[userIndex], userIndex];
  // }
  // findUserByEmail(email: string): [UserDTO, number] {
  //   const userIndex = users.findIndex(
  //     (registerdUser) => registerdUser.email === email,
  //   );
  //   if (-1 === userIndex) throw new NotFoundException();
  //   return [users[userIndex], userIndex];
  // }
}
