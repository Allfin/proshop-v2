import dotenv from 'dotenv';
import Midtrans from 'midtrans-client';
dotenv.config();
const { MD_CLIENT_KEY, MD_SERVER_KEY } = process.env;

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: MD_SERVER_KEY,
  clientKey: MD_CLIENT_KEY,
});

export { snap };
