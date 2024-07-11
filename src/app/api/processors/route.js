// server/api/processors.ts
import axios from 'axios'; 
import { NextResponse } from 'next/server';

export async function GET(request) {
  try { 

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;

    const baseUrl = process.env.DRAGONPAY_TEST_BASE_URL;

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

    //  console.log(response);
    // const parsedData = await parseStringPromise(response.data);
    // console.log('Parsed Data:', parsedData);

    // if (!parsedData.ArrayOfProcessorInfo || !parsedData.ArrayOfProcessorInfo.ProcessorInfo) {
    //   throw new Error('Malformed API response');
    // }

    // const processors = parsedData.ArrayOfProcessorInfo.ProcessorInfo.map(proc => ({
      // e-wallet 'GCSH','PYMB','PYPL'
      // direct banks 'BPIA','UBDD','RCDD','CBDD'
      const processors = response.filter((x)=>['GCSH','PYMB','PYPL','CC','BPIA','UBDD','RCDD','CBDD', 'SBCB', 'VLRC', 'TBTG'].includes(x.procId)).map(proc => ({
          procId: proc.procId,
          shortName: proc.shortName,
          longName: proc.longName,
          logo: proc.procId!='PYPL'? proc.logo : 'https://test.dragonpay.ph/images/paypal.jpg',
          remarks: proc.remarks,
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
