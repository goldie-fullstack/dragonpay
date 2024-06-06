// next.config.mjs
import dotenv from 'dotenv';

dotenv.config();

const nextConfig = {
  env: {
    MERCHANT_ID: process.env.MERCHANT_ID,
    PASSWORD: process.env.PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
  },
};

export default nextConfig;
