// next.config.mjs
import dotenv from 'dotenv';

dotenv.config();

const nextConfig = {
  env: {
    MERCHANT_ID: process.env.MERCHANT_ID,
    PASSWORD: process.env.PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test.dragonpay.ph',
        port: '',
        pathname: '/Bank/**',
      },
      {
        protocol: 'https',
        hostname: 'gw.dragonpay.ph',
        port: '',
        pathname: '/Bank/**',
      },
      {
        protocol: 'https',
        hostname: 'test.dragonpay.ph',
        port: '',
        pathname: '/images/**',
      },
    ]
  }
}; 
export default nextConfig;
