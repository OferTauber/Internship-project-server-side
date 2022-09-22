import * as dotenv from 'dotenv';

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const REGION = process.env.REGION;
export const CORS = process.env.CORS;
