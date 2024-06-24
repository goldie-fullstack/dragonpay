// server/api/request-payment.ts
import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // const { amount, description, email, typeOfBank, currency } = await req.json();

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const baseUrl = process.env.DRAGONPAY_PAYOUT_TEST_URL;
    const txnid = `txn${Date.now()}`;

    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    }

    const payload = {
      TxnId: txnid,
      FirstName: '',
      FirstName: "Robertson",
      MiddleName: "Sy",
      LastName: "Chiang",
      Amount: "1000",
      Currency: "PHP",
      Description: "Testing JSON payout",
      ProcId: "CEBL",
      ProcDetail: "dick@dragonpay.ph",
      RunDate: "2019-02-26",
      Email: "dick@dragonpay.ph",
      MobileNo: "09175281679"
    };

    const endpoint = `${baseUrl}/${merchantId}/post`;
    // const endpoint = `${baseUrl}/Transaction/Create`;
    // const token = 'VFJDS1RJTkM6eGlhTngzbWcxTkxhZlB6';
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

    // console.log('Response from Dragonpay:', response);

    return NextResponse.json(response.data);

    // if (response.data.Status === 'S' || response.data.Url) {
    //   return NextResponse.json({ url: response.data.Url });
    // } else {
    //   throw new Error(response.data.ErrorMessage || 'Payment request failed');
    // }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
