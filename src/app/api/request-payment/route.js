import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, description, email, typeOfBank } = await req.json();
    
    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const baseUrl = process.env.DRAGONPAY_TEST_BASE_URL;
    const txnid = `txn${Date.now()}`;
    
    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing required environment variables');
    }

    // Log values used in digest calculation
    console.log('Merchant ID:', merchantId);
    console.log('Transaction ID:', txnid);
    console.log('Amount:', amount);
    console.log('Password:', password);

    const digest = crypto.createHash('sha1').update(`${merchantId}:${txnid}:${amount}:${password}`).digest('hex');

    // Log calculated digest
    console.log('Calculated Digest:', digest);

    const payload = {
      'Amount': amount,
      'Currency': 'PHP',
      'Description': description,
      'Email': email
    };

    // Log payload
    console.log('Payload:', payload);

    const endpoint = `${baseUrl}/${txnid}/post`;
    console.log('Endpoint URL:', endpoint);

    const response = await axios.post(`${baseUrl}/${txnid}/post`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: merchantId,
        password: password
      }
    });

    console.log('Response from Dragonpay:', response.data);

    if (response.data.Status === 'S' || response.data.Url) {
      console.log('URL:', response.data.Url);
      return NextResponse.json({ url: response.data.Url });
    } else {
      return NextResponse.json(response.data);
    }

  } catch (error) {
    if (error.response) {
      console.error('Error response from Dragonpay:', error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else if (error.request) {
      console.error('No response received from Dragonpay:', error.request);
      return NextResponse.json({ error: 'No response received from Dragonpay' }, { status: 500 });
    } else {
      console.error('Error in setting up request:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
