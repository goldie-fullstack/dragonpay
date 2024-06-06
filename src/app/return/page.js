'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '../../../public/dragonpay.webp'
import Image from 'next/image';

export default function ReturnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnPageContent />
    </Suspense>
  );
}

function ReturnPageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const txnid = searchParams.get('txnid');
    const refno = searchParams.get('refno');
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    
    setStatus(status);
    setMessage(message);

    // Optionally, you can add logic to handle different statuses
  }, [searchParams]);

  return (
    <div className='pt-8 w-1/2 block m-auto'>
      <Image src={logo} alt='logo' width={350} className='m-auto block' />
        <div className='border border-black w-1/2 m-auto p-6 mt-6'>
          <h1>Payment Status</h1>
          <p>Transaction ID: {searchParams.get('txnid')}</p>
          <p>Reference Number: {searchParams.get('refno')}</p>
          <p>Status: {status}</p>
          <p>Message: {message}</p> 
        </div>
    </div>
  );
}
