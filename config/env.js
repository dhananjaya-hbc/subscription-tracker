import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

const envPath = path.resolve(process.cwd(), `.env.${env}.local`);

dotenv.config({ path: envPath });

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const ARCJET_KEY = process.env.ARCJET_API_KEY;