import { Controller, Get, Param } from '@nestjs/common';
import { PortsService } from './ports.service';
import FirstOrderPortDTO from 'src/Data_transfer_objects/port.dto';
import SecondOrderPortDTO from 'src/Data_transfer_objects/second_order_port.dto';

@Controller('/ports')
export class PortsController {
  constructor(private portsService: PortsService) {}

  @Get(':portId')
  async a(@Param('portId') portId: string): Promise<SecondOrderPortDTO> {
    return await this.portsService.getSecondOrderPort(portId);
  }

  @Get()
  async getAllFirstOrderPorts(): Promise<FirstOrderPortDTO[]> {
    const res = await this.portsService.getAllFirstOrderPorts();
    return res;
  }
}

// @Put(':id')
// async editUser(
//   @Param('id') id: string,
