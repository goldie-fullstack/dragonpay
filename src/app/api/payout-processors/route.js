// server/api/processors.ts
import axios from 'axios'; 
import { NextResponse } from 'next/server';

export async function GET(request) {
  try { 

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;

    const baseUrl = process.env.DRAGONPAY_PAYOUT_TEST_URL;

    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    }

    // to do minamnt - maxamt, dayOfWeek, startTime, endTime, mustRedirect
 
    const endpoint = `${baseUrl}/processors`;


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
    .then((res) => {
     // console.log('processors: ',res);
      return res.data;
    }).catch ((error)=> {
      console.log(error);
      throw error;
    });

 
      const processors = response.map(proc => ({
          procId: proc.procId,
          shortName: proc.shortName,
          logo: proc.logo,
          status: proc.status,
          merchantFee: proc.merchantFee,
          userFee: proc.userFee
        })
      );

    // console.log('Processed Data:', processors);

    // return  new Response(processors);
    return NextResponse.json(processors);


  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
