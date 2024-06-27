import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { txnid, refno, status, message, digest } = await req.json();
    const merchantPassword = process.env.DRAGONPAY_PASSWORD;

    // Validate the digest
    const computedDigest = crypto
      .createHash('sha1')
      .update(`${txnid}:${refno}:${status}:${merchantPassword}`)
      .digest('hex');

    if (computedDigest !== digest) {
      console.error('Invalid digest');
      return new Response('result=INVALID_DIGEST', { status: 400 });
    }

    console.log('Postback received:', { txnid, refno, status, message });

    // Handle the transaction status and update your database as needed
    // Example: if (status === 'S') { // Handle successful payment }

    return new Response('result=OK');
  } catch (error) {
    console.error('Error handling postback:', error);
    return new Response('result=ERROR', { status: 500 });
  }
}
