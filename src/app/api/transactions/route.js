// server/api/request-payment.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startdate');
  const endDate = searchParams.get('enddate');

  console.log(startDate)
  
  try {
    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const baseUrl = process.env.DRAGONPAY_TEST_BASE_URL;
   
    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    }

    const endpoint = `${baseUrl}/transactions?startdate=${startDate}&enddate=${endDate}`;

    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: merchantId,
        password: password
      }
    })
    
    if (response.status === 200) {
        return NextResponse.json(response.data);
    }
   
  } catch (error) {
    // console.error('Error processing payment:', error);
    let status;
    if (error.status)
      status = error.status;
    return NextResponse.json({ error: error.message }, { status: status });
  }
}
