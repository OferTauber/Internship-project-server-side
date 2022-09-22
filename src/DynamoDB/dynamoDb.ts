import {
  DynamoDBClient,
  GetItemCommand,
  BatchGetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import UserDTO from 'src/Data_transfer_objects/user.dto';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import FirstOrderPortDTO from 'src/Data_transfer_objects/port.dto';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const REGION = process.env.REGION;

const dynamoDBClient = new DynamoDBClient({ region: REGION });

const onePortTable = 'operational_dashboard_ports_second_order';
const usersTable = 'operational_dashboard_users';
const allPortsChanks = 'operational_dashboard_ports_chankes';

export const getUserFromDB = async (email: string): Promise<UserDTO | any> => {
  try {
    const params = {
      TableName: usersTable,
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
      TableName: usersTable,
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
      TableName: usersTable,
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
    TableName: usersTable,
    Key: marshall({ email }),
    UpdateExpression: 'SET tokens= :emptyArray',
    ExpressionAttributeValues: marshall({ ':emptyArray': [] }),
  };

  await dynamoDBClient.send(new UpdateItemCommand(params));
};

export const getAllFirstOrderPortsFromDB = async (): Promise<
  FirstOrderPortDTO[]
> => {
  const generate20KyesArr = (startValue: number): any => {
    const keysArr = [];
    for (let i = 0; i < 72; i++) {
      keysArr.push(marshall({ chankNum: i + startValue }));
    }

    return keysArr;
  };

  const params = {
    RequestItems: {
      [allPortsChanks]: {
        Keys: generate20KyesArr(0),
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

//* ----- privet  -----

const convertItemToUserDTO = (item: any): UserDTO => {
  const {
    email,
    password,
    isAdmin,
    tokens,
    isActive,
  }: {
    email: string;
    password: string;
    isAdmin: boolean;
    tokens: string[];
    isActive: boolean;
  } = item;
  return new UserDTO(email, password, isAdmin, tokens, isActive);
};
