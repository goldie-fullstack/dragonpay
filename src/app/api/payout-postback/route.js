import { NextResponse } from 'next/server';
import crypto from 'crypto'; 
import qs from 'qs'

export async function POST(req) {
  try { 
    const paramsText = decodeURIComponent(await req.text())
    const paramsJson = qs.parse(paramsText)

    const txnid = paramsJson?.txnid;
    const refno = paramsJson?.refno;
    const status = paramsJson?.status;
    const message = paramsJson?.message;
    const digest = paramsJson?.digest; 
   
    const merchantPassword = process.env.DRAGONPAY_PASSWORD;

    // Validate the digest
    const computedDigest = crypto
      .createHash('sha1')
      .update(`${txnid}:${refno}:${status}:${message}:${merchantPassword}`)
      .digest('hex').toString();

    if (computedDigest !== digest) {
      console.error('Invalid digest');
      return new Response('result=INVALID_DIGEST', { status: 400 });
    } 
    console.log('Postback received:', { txnid, refno, status, message });

    // Handle the transaction status and update your database as needed
    // Example: if (status === 'S') { // Handle successful payment }

    return NextResponse.json('result=OK');
  } catch (error) {
    console.error('Error handling postback:', error);
   
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
