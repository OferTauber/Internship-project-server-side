import { Injectable, NotFoundException } from '@nestjs/common';
import // getAllFirstOrderPortsFromDB,
// getSecondOrderPort,
'../../utils/dynamoDb';
import {
  getAllFirstOrderPortsFromDB,
  getSecondOrderPort,
} from '../../utils/mogo';
import FirstOrderPortDTO from 'src/Data_transfer_objects/port.dto';
import SecondOrderPortDTO from 'src/Data_transfer_objects/second_order_port.dto';

@Injectable()
export class PortsService {
  getAllFirstOrderPorts = async (): Promise<FirstOrderPortDTO[]> => {
    return await getAllFirstOrderPortsFromDB();
  };

  getSecondOrderPort = async (portId: string): Promise<SecondOrderPortDTO> => {
    try {
      const port = await getSecondOrderPort(portId);

      if (!port) throw new NotFoundException();

      return port;
    } catch (err) {
      console.error(err);
      throw new NotFoundException();
    }
  };
}
