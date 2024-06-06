import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, description, email } = await req.json();
    console.log('Request received:', { amount, description, email });

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const testBaseUrl = process.env.DRAGONPAY_TEST_BASE_URL;

    if (!merchantId || !password || !testBaseUrl) {
      throw new Error('Missing required environment variables');
    }

    const txnid = `txn_${Date.now()}`;
    const digest = crypto.createHash('sha1').update(`${merchantId}:${txnid}:${amount}:${password}`).digest('hex');
    console.log('Digest:', digest);

    const payload = {
      merchantid: merchantId,
      txnid,
      amount,
      ccy: 'PHP',
      description,
      email,
      digest,
      postbackurl: 'https://aa41-119-94-165-59.ngrok-free.app/api/postback',
      returnurl: 'https://aa41-119-94-165-59.ngrok-free.app/return',
    };

    console.log('Payload:', payload);

    const response = await axios.post(testBaseUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    });

    console.log('Response from Dragonpay:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Error response from Dragonpay:', error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Dragonpay:', error.request);
      return NextResponse.json({ error: 'No response received from Dragonpay' }, { status: 500 });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in setting up request:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
