import { Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import run, {
  getUserFromDB,
  getUserById,
  addTokenToUser,
  uploadPortsChancks,
  getFirstOrderPorts,
  uploadSecondOrderPorts,
  getSecondOrderPort,
} from './utils/mogo';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Put()
  // async test(): Promise<any> {
  //   const user = await getUserById('633ab0d8ed09597be1ae72ef');
  //   return await getSecondOrderPort('wld_trs_ports_wfp.14315');
  //   return await uploadSecondOrderPorts();
  //   return await getFirstOrderPorts();
  //   return await uploadPortsChancks();
  //   return await addTokenToUser(user, '123');
  //   return await getUserById('633ab0d8ed09597be1ae72ef');
  //   return await getUserByEmail('user@email.com');
  //   return await run();
  //   return await bcrypt.hash('123', 10);
  // }
}
