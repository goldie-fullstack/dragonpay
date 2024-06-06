'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReturnPage() {
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
      <h1>Payment Status</h1>
      <p>Transaction ID: {searchParams.get('txnid')}</p>
      <p>Reference Number: {searchParams.get('refno')}</p>
      <p>Status: {status}</p>
      <p>Message: {message}</p>
    </div>
  );
}
