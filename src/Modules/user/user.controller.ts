import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // todo - middelware - isAdmin?
  // async addUser(
  //   @Body('userName') userName: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  //   @Body('isAdmin') isAdmin: boolean,
  // ): Promise<any> {
  //   const newUserId = await this.userService.createUser(
  //     email,
  //     password,
  //     isAdmin,
  //   );

  //   return { id: newUserId };
  // }

  // @Put(':id')
  // async editUser(
  //   @Param('id') id: string,
  //   @Body()
  //   completBody: {
  //     userName?: string;
  //     email?: string;
  //     password?: string;
  //     isAdmin?: boolean;
  //   },
  // ): Promise<void> {
  //   const { userName, email, password, isAdmin } = completBody;
  //   await this.userService.updateUser(id, userName, email, password, isAdmin);
  // }

  // @Delete(':id')
  // deleteUser(@Param('id') id: string): void {
  //   this.userService.removeUser(id);
  // }

  // @Patch(':id')
  // updatUserActivation(
  //   @Param('id') id: string,
  //   @Body('isActiv') isActiv: boolean,
  // ) {
  //   this.userService.toogleUserActivStatus(id, isActiv);
  // }
}
