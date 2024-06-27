import { NextResponse } from 'next/server';
import crypto from 'crypto'; 

export async function GET(req) {
  try { 
    // const { txnid, refno, status, message, digest } = await req.json();
    const txnid = req.nextUrl.searchParams.get('merchanttxnid');
    const refno = req.nextUrl.searchParams.get('refno');
    const status = req.nextUrl.searchParams.get('status');
    const message = req.nextUrl.searchParams.get('message');
    const digest = req.nextUrl.searchParams.get('digest'); 
   
    const merchantPassword = process.env.DRAGONPAY_PASSWORD;

    // Validate the digest
    const computedDigest = crypto
      .createHash('sha1')
      .update(`${txnid}:${refno}:${status}:${message}:${merchantPassword}`)
      .digest('hex');

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
