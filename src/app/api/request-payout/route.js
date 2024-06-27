// server/api/request-payment.ts
import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // const { firstName, middleName, lastName, amount, currency, description, procId, procDetail, email, mobileNo } = await req.json();

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const apiKey = process.env.DRAGONPAY_APIKEY;
    const baseUrl = process.env.DRAGONPAY_PAYOUT_TEST_URL;
    const txnid = `txn${Date.now()}`;
    const rundate = new Date.toISOString().split('T')[0];

    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    }

    // const payload = {
    //   TxnId: txnid, 
    //   FirstName: firstName,
    //   MiddleName: middleName,
    //   LastName: lastName,
    //   Amount: amount,
    //   Currency: currency,
    //   Description: description,
    //   ProcId: procId,
    //   ProcDetail: procDetail,
    //   RunDate: rundate,
    //   Email: email,
    //   MobileNo: mobileNo
    // };

    const payload = {
      TxnId: txnid, 
      FirstName: "Robertson",
      MiddleName: "Sy",
      LastName: "Chiang",
      Amount: "1000",
      Currency: "PHP",
      Description: "Testing JSON payout",
      ProcId: "CEBL",
      ProcDetail: "dick@dragonpay.ph",
      RunDate: rundate,
      Email: "dick@dragonpay.ph",
      MobileNo: "09175281679"
    };

    const endpoint = `${baseUrl}/${merchantId}/post`;
    // const token = Buffer.from(`${merchantId}:${password}`, 'utf8').toString('base64');
    
    // axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // auth: {
      //   username: merchantId,
      //   password: password
      // }
    })
    .then((res) => {
      console.log("res:",res);
      return res;
    }).catch ((error)=> {
      console.log(error);
      throw error.response.data;
    });

    // console.log('Response from Dragonpay:', response);
    return new NextResponse.json(response);
    // return NextResponse.json(response);

    // if (response.data.Status === 'S' || response.data.Url) {
    //   return NextResponse.json({ url: response.data.Url });
    // } else {
    //   throw new Error(response.data.ErrorMessage || 'Payment request failed');
    // }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: error.Message }, { status: 500 });
  }
}
