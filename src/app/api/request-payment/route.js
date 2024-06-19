// server/api/request-payment.ts
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
      throw new Error('Missing environment variables');
    }

    const payload = {
      Amount: amount,
      Description: description,
      Email: email,
      ProcId: typeOfBank,
      Currency: "PHP"
    };

    const endpoint = `${baseUrl}/${txnid}/post`;
    // const endpoint = `${baseUrl}/Transaction/Create`;
 
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: merchantId,
        password: password
      }
    })
    .then((res) => {
      // console.log(res);
      return res;
    }).catch ((error)=> {
      console.log(error);
      throw error;
    });

    console.log('Response from Dragonpay:', response);

    if (response.data.Status === 'S' || response.data.Url) {
      return NextResponse.json({ url: response.data.Url });
    } else {
      throw new Error(response.data.ErrorMessage || 'Payment request failed');
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
