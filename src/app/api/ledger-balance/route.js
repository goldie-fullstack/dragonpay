// server/api/processors.ts
import axios from 'axios'; 
import { NextResponse } from 'next/server';

export async function GET(request) {
  try { 

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const apiKey = process.env.DRAGONPAY_APIKEY;
    const baseUrl = process.env.DRAGONPAY_PAYOUT_TEST_URL;

    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    } 
    
    const endpoint = `${baseUrl}/${merchantId}/balance`;

    axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    const response = await axios.get(endpoint, {
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
     // console.log('processors: ',res);
      return res.data;
    }).catch ((error)=> {
      console.log(error);
      throw error.response.data;
    });

    //  console.log(response); 

    // return  new Response(processors);
    // const balance = 1000;
    // return NextResponse.json(balance);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error checking ledger balance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
