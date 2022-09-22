# **_Operational-Dashboard-API_**

This repo containes the Operational-dashboard platform's server-side.
This is a REST-API NestJS-based server that handles the application user-registration and port-information.
The data is stored in AWS-DynamoDB database and the server mediates between it and the client side.

# **_Background_**

The purpose of the Operational-dashboard app is to display information about all cargo ports in the world, both in a list view and in a map view.
The application is intended for DockTech’s existing customers and/or for marketing purposes - allawing access only to registerd users.

# **_Getting started_**

## Prerequisites:

- Node V 16.15 or higher
- AWS sectrt access
- AWS user id

## Installation:

```bash
npm install
```

## Environment Variables:

In order to run the server - the following environment variables are required:

- **REGION** - [AWS region](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), in the format xx-xxxx-n

  ##### _example: 'us-west-2'_

- **JWT_SECRET** - secret key \<string> for jwt validation
  ##### _example: 'TopSeacret-2lf$$kds'_
- **PORT** - port num for NestJS to listen to, in the format: nnnn
  ##### _example: '8080'_
- **CORS** - in string format.
  ##### _example: 'http://localhost:3000'_

### AWS credentials as environment variables:

- As the server need to comunicate with DynamoDB - AWS credentials are required. The credentials can be supplyed as environment variables

- Currently - the deployed version is not working properly, and it is very likely that the problem is wrong names for the environment variables. **_When the solution is found - it is important to update it here_**.

# Run localy

To run the program localy - add a '.env' file in the repo root. Use the '.env.example' file (also in the root) for reference.

### How to run it:

```bash
# Compile once and run:
npm run start

# Compile and run in whtch mode:
npm run start:dev
```

- AWS credentials can be provided by environment variables (see note in the previous section) or through the [AWS CLI](https://aws.amazon.com/cli/)

# Deploy

**You will need to provide the environment variables specified above**

```bash
#Build:
nest run build

# Start:
nest start

# Start: prod:
 node dist/main
```

# **_REST API Routes_**

## Get hellow ('life signal')

Uses as a 'life signal'/ CORS check.

### Request

```javascript
GET "/"
```

### Response

```javascript
'Hello World!';
```

---

## Login

Accepts credentials, and if the user is registered returns a JWT.
The call adds the JWT to the user record in the database.

### Request

```javascript
POST "/auth/login"
Body: {"email": "me@email.com", "password": "123pass"}
```

### Response

```javascript
JWT barer token <string>
```

---

## Logout

Accepts JWT (as a barer token) and returns null.
The call removes the JWT from the user record in the database.

### Request

```javascript
POST "/auth/logout"
Headers: {authorization: "bearer <token>"}
```

### Response - none

---

## Logout all (logout from all devices)

Accepts JWT (as a barer token) and returns null.
The call removes **all** JWTs from the user record in the database.

### Request

```javascript
POST "/auth/logout-all"
Headers: {authorization: "bearer <token>"}
```

### Response - none

---

## Validate token

Accepts JWT (as a barer token) and only checks if its valid, withot accessing the DB.

Note: If user send JWT after he logs out (meaning the same JWT is no longer registerd in the DB) the JWT will be valid! The call only confirms the payload of the JWT (mainly whether the user is an admin) and its expiration date.

### Request

```javascript
GET "/auth/validate-token"
Headers: {authorization: "bearer <token>"}
```

### Response

```javascript
true; // if valid:
false; // if invalid
```

---

## Get first order ports

Initial data for the map/list view - an array of over 3500 ports - containing only minimal information for each.

The route is protected by a middleware that verifies the JWT (including checking whether the token is registered to the user)

### Request

```javascript
GET "/ports"
Headers: {authorization: "bearer <token>"}
```

### Response

```typescript
[{
  geometry: { type: string; coordinates: [number, number] };
  id: string;
  geometry_name: string;
  type: string;
  properties: {
    portname: string;
    country: string;
    iso3_op: string;
    code: string;
    iso3: string;
  }];
```

---

## Get second order port

More detailed information about a specific port - according to the requested ID.

The route is protected by a middleware that verifies the JWT (including checking whether the token is registered to the user)

### Request

```javascript
GET "/ports/:portId"
Headers: {authorization: "bearer <token>"}
```

### Response

```typescript
{
  id: string;
  portname?: string;
  code?: string;
  prttype?: string;
  prtsize?: string;
  status?: string;
  humuse?: string;
  locprecision?: string;
  latitude?: number;
  longitude?: number;
  iso3?: string;
  iso3_op?: string;
  country?: string;
  createdate?: string;
  updatedate?: string;
  geonameid?: number;
  isDochTeckPartner?: boolean;
};
```

# Data flow in the app

## Login and logout

![Login and logout flow](img/DockTech%20-%20auth%20flow1.jpg 'Login and logout flow')

## Get ports flow

![Get ports flow](img/DockTech%20-%20auth%20flow2.jpg 'Get ports flow')

# Database

The database consists of 3 tables:

## Users

The user table stores user records, which include:

- email (Partition Key)
- password (encrypted)
- isAdmin (bool)
- tokens - array of JWT's - one for eavry connected device.

Note! - Currently there is no automatic mechanism that 'cleans' the array of tokens. If a user connects to the application from any device and is automatically disconnected (for example due to an expired token) the tokens will simply accumulate in the array.

The server have a "disconnect from all devices" function that invokes using the '/auth/logout-all' route, however it is not called by the client side.

---

## First order ports

The First order ports table contains basic information about all ports. The data obtained from this table is used on the client side to build the map view and the table view.

The full list of ports includes over 3500 ports. In order to avoid multiple calls to the database (which will cost both performance and money) - the ports are organized in "chunks" - 72 arrays of 50 ports each.

This structure provides an answer to the limitations of the BatchGetItemCommand command of the database - you can get a maximum of 100 items in one call, while the size of each item and the size of the entire information are also limited.

Each "chunk" record includes:

- Partition Key - the number of the channel (0-71)
- An array of 50 ports.

#### Each of the ports in the array includes a location (an array of latitude and longitude lines), the name of the port, the port code, etc. - **Some of the information is missing**

#### Each port has a unique ID, which is the same as the Partition Key in the second order ports table

- :+1: The advantages of this structure are good fast performance in relation to the amount of information, as well as minimal billing.
- :-1: The disadvantages are the difficulty of updating, adding and removing ants.
- Currently, the client side does not perform such operations. If this changes - **it is recommended to re-examine the feasibility of the described table structure and consider whether to replace it.**

## Second order ports

This table is much simpler than the previous one - each port is an independent record, and the Partition Key is the ID of the port.

Since this is a NoSQL database - you can add as many fields as you want and this will not affect the performance.

**_Important!:_** On a successful call, the server should return an object of type "SecondOrderPortDTO" defined in a file with the same name in the Data_transfer_objects folder.
When adding new fields to the database - **it is mandatory to update the DTO**, otherwise they are expected to be received from the database to the server but not sent further to the client.
