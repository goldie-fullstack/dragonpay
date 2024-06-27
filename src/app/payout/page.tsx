'use client'; 
import Image from 'next/image'
import logo from '../../../public/dragonpay.webp';
import React, { useEffect, useState } from 'react'

const Payout = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    amount: '',
    currency: 'PHP',
    description: '',
    procId: '',
    procDetail: '',
    runDate: '',
    email: '',
    mobileNo: '',
    birthDate:'',//(optional)
    nationality:'',//(optional)
    address: {
      street1: '',
      street2: '',
      barangay:'',
      city: '',
      province:'',
      country: ''
    },//(optional)
  });

  
  useEffect(() => {
    const fetchProcessors = async () => {
      // setLoadingProcessors(true);
      const res = await fetch('/api/payout-processors');
      const availableProcessors = await res.json(); 
      // setLoadingProcessors(false);
      // setProcessors(availableProcessors); 
    };
    fetchProcessors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  
  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  
  return (
    <div className='w-full h-full mx-auto lg:max-w-2xl flex flex-col'>

      <div className='flex-1'>
        <section className="py-8">
          <Image src={logo} alt='logo' priority={true} width={350} className='m-auto block' />
        </section>

        <section className="pb-12">
          <form className='border border-black md:w-96 px-3	 m-auto p-6 mt-6 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' 
            onKeyDown={(e) => checkKeyDown(e)} onSubmit={handleSubmit}>
            
            <div className='columns-3'>
              <div className='mb-3'>
                <label className='uppercase mb-4 text-gray-800 text-sm'>First Name:</label>
                <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div className='mb-3'>
                <label className='uppercase mb-4 text-gray-800 text-sm'>Middle Name:</label>
                <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="text" name="middleName" value={formData.middleName} onChange={handleChange} required />
              </div>

              <div className='mb-3'>
                <label className='uppercase mb-4 text-gray-800 text-sm'>Last Name:</label>
                <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
           
            <div className='mb-3'>
              <label className='uppercase mb-4 text-gray-800 text-sm'>Amount:</label>
              <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='uppercase mb-4 text-gray-800 text-sm'>Description:</label>
              <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="text" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='uppercase mb-4 text-gray-800 text-sm'>Email:</label>
              <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
              <label className='uppercase mb-4 text-gray-800 text-sm'>Mobile No.:</label>
              <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
            </div>

            <div className='mb-3'>
              <label className="uppercase mb-4 text-gray-800 text-sm">Payment Method:</label>

            </div>
          </form>
        </section>

      </div>  
    </div>
  )
}

export default Payout