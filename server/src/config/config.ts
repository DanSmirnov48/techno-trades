import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define the schema for your environment variables
const envSchema = z.object({
    PORT: z.string(),

    NODE_ENV: z.string(),

    MONGO_URI: z.string(),

    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),

    JWT_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),

    EMAIL_OTP_EXPIRE_SECONDS: z.string().transform(Number),

    JWT_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),

    ACCESS_TOKEN_EXPIRY: z.string().transform(Number),
    REFRESH_TOKEN_EXPIRY: z.string().transform(Number),

    EMAIL_EMAIL: z.string().email(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.string().regex(/^\d+$/).transform(Number),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_TEST_KEY: z.string(),

    CLIENT_URL: z.string().url(),
});

// Validate and parse the environment variables
const ENV = envSchema.parse(process.env);

export default ENV;
