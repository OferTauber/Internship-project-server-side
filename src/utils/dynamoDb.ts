import {
  DynamoDBClient,
  GetItemCommand,
  BatchGetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import UserDTO, {
  convertItemToUserDTO,
} from 'src/Data_transfer_objects/user.dto';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import FirstOrderPortDTO from 'src/Data_transfer_objects/port.dto';
import SecondOrderPortDTO, {
  convertTypeAnyToSecondOrderPortDTO,
} from 'src/Data_transfer_objects/second_order_port.dto';
import { NotFoundException } from '@nestjs/common';
import { REGION } from './EnvironmentVariables';

const dynamoDBClient = new DynamoDBClient({ region: REGION });

const secondOrderPortsTableName = 'operational_dashboard_ports_second_order';
const usersTableName = 'operational_dashboard_users';
const allPortsChanksTableName = 'operational_dashboard_ports_chankes';

export const getUserFromDB = async (email: string): Promise<UserDTO | any> => {
  try {
    const params = {
      TableName: usersTableName,
      Key: marshall({ email }),
    };
    const res: any = await dynamoDBClient.send(new GetItemCommand(params));
    if (!res.Item) return null;
    const user = convertItemToUserDTO(unmarshall(res.Item));
    return user;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const addTokenToUser = async (user: UserDTO, newToken: string) => {
  try {
    const params = {
      TableName: usersTableName,
      Key: marshall({ email: user.email }),
      UpdateExpression: 'SET tokens = list_append(tokens, :token)',
      ExpressionAttributeValues: marshall({
        ':token': [newToken],
      }),
    };
    await dynamoDBClient.send(new UpdateItemCommand(params));
  } catch (e) {
    console.error(e);
  }
};

export const removeTokenFromUser = async (
  user: UserDTO,
  tokenToRemove: string,
) => {
  try {
    const index = user.tokens.findIndex((token) => token === tokenToRemove);

    if (-1 === index) return;

    const params = {
      TableName: usersTableName,
      Key: marshall({ email: user.email }),
      UpdateExpression: `REMOVE tokens[${index}]`,
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
  } catch (e) {
    console.warn(e);
  }
};

export const removeAllUserTokens = async (email: string) => {
  const params = {
    TableName: usersTableName,
    Key: marshall({ email }),
    UpdateExpression: 'SET tokens= :emptyArray',
    ExpressionAttributeValues: marshall({ ':emptyArray': [] }),
  };

  await dynamoDBClient.send(new UpdateItemCommand(params));
};

export const getAllFirstOrderPortsFromDB = async (): Promise<
  FirstOrderPortDTO[]
> => {
  const generate20KyesArr = (): any => {
    const numOfChanksInDB = 72;
    const keysArr = [];
    for (let i = 0; i < numOfChanksInDB; i++) {
      keysArr.push(marshall({ chankNum: i }));
    }

    return keysArr;
  };

  const params = {
    RequestItems: {
      [allPortsChanksTableName]: {
        Keys: generate20KyesArr(),
      },
    },
  };

  try {
    const data = await dynamoDBClient.send(new BatchGetItemCommand(params));

    const marshalldData: any =
      data.Responses.operational_dashboard_ports_chankes;

    const portsToReturn: FirstOrderPortDTO[] = [];

    for (const chank of marshalldData) {
      const unmarshalldChank: any = unmarshall(chank);

      portsToReturn.push(...unmarshalldChank.ports);
    }

    return portsToReturn;
  } catch (e) {
    console.error(e);
    throw new NotFoundException(e);
  }
};

export const getSecondOrderPort = async (
  id: string,
): Promise<SecondOrderPortDTO | false> => {
  try {
    // console.log(id);
    const params = {
      TableName: 'operational_dashboard_second_order_ports',

      Key: marshall({ id }),
    };
    const res: any = await dynamoDBClient.send(new GetItemCommand(params));
    if (!res.Item) return false;
    const port = convertTypeAnyToSecondOrderPortDTO(unmarshall(res.Item));
    return port;
  } catch (err) {
    console.error(err);
    return err;
  }
};
