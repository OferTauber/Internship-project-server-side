import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { MONGO_PASSWORD, MONGO_USERNAME } from './EnvironmentVariables';
import UserDTO from 'src/Data_transfer_objects/user.dto';
import { convertItemToUserDTO } from 'src/Data_transfer_objects/user.dto';

// import { ports } from './temp'; // todo remove!!!!!
// import { chankes } from './chankes'; // todo remove!!!!!
// import secondOrderPorts from './second_order_ports'; // todo remove!!!!!

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@docktech.4vkoqas.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  client.close();
});
const database = client.db('PortsApp');
const usersCollection = database.collection('users');
const firstOrderPortsColection = database.collection('first-order-ports');
const secondOrderPortsColection = database.collection('second-order-ports');
const firstOrderPortsColectionTest = database.collection(
  'first-order-ports-test',
); // todo remove!!!!!

const run = async () => {
  try {
    const query = { email: 'ofer@email.com' };
    const user = await usersCollection.findOne(query);

    return user;
  } catch (e) {
    console.dir(e);
  }
};
export default run;

export const getUserFromDB = async (email) => {
  try {
    const query = { email };
    const user = await usersCollection.findOne(query);

    console.log(user);

    if (!user) throw new Error('User not founed');

    return convertItemToUserDTO(user);
  } catch (e) {
    console.log(e);

    throw new Error(e);
  }
};

export const getUserById = async (id) => {
  try {
    const query = { _id: new ObjectId(id) };
    const user = await usersCollection.findOne(query);

    if (!user) throw new Error('User not founed');

    return convertItemToUserDTO(user);
  } catch (e) {
    console.log(e);

    throw new Error(e);
  }
};

export const addTokenToUser = async (user, newToken) => {
  try {
    user.tokens.push(newToken);

    const filter = { _id: user._id };
    const updateDocunet = {
      $set: {
        tokens: user.tokens,
      },
    };

    usersCollection.updateOne(filter, updateDocunet);
  } catch (e) {
    console.log(e);
  }
};

export const removeTokenFromUser = async (user, tokenToRemove) => {
  try {
    const index = user.tokens.findIndex((token) => token === tokenToRemove);

    if (-1 === index) return;

    user.tokens.splice(index, 1);

    const filter = { _id: user._id };
    const updateDocunet = {
      $set: {
        tokens: user.tokens,
      },
    };

    usersCollection.updateOne(filter, updateDocunet);
  } catch (e) {
    console.warn(e);
  }
};

export const getAllFirstOrderPortsFromDB = async () => {
  try {
    return await firstOrderPortsColection.find({}).toArray();
  } catch (e) {
    console.log(e);
  }
};

export const getSecondOrderPort = async (id) => {
  try {
    return await secondOrderPortsColection.findOne({ id });
  } catch (e) {
    console.log(e);
  }
};
