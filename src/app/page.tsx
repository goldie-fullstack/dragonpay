'use client'; 

import { useState, useEffect } from 'react';
import { getAvailableProcessors } from '../utils/api';
// import { PaymentProcessor } from '../types';
import axios from 'axios';
import logo from '../../public/dragonpay.webp';
import Image from 'next/image';
import { NextResponse } from 'next/server';

interface Processor {
  procId: string;
  shortName: string;
  longName: string;
  logo: string;
  remarks: string;
}

const Home = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    email: '',
    typeOfBank: ''
  });
  const [processors, setProcessors] = useState<Processor[]>([]);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  useEffect(() => {
    const fetchProcessors = async () => {
      // const availableProcessors = await getAvailableProcessors();
      // console.log('Fetched Processors:', availableProcessors); // Debugging line to check fetched data
      // setProcessors(availableProcessors);

      const res = await fetch('/api/processors');
      const availableProcessors = await res.json();
      // console.log('Fetched Processors:', JSON.stringify(availableProcessors)); // Debugging line to check fetched data
      setProcessors(availableProcessors); 
    };
    fetchProcessors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    console.log(formData);
    console.log(activeButtonIndex);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/request-payment', formData);
      // console.log(response);
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        console.error('Invalid response from server:', response.data);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  

  return (
    <div className='pt-8 w-full block m-auto'>
      <Image src={logo} alt='logo' width={350} className='m-auto block' />
      <form className='border border-black w-72 md:w-96 m-auto p-6 mt-6' onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='block text-black	'>Amount:</label>
          <input className='block w-full text-black border border-black p-1' type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className='mb-3'>
          <label className='block text-black	'>Description:</label>
          <input className='block w-full text-black border border-black p-1' type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className='mb-3'>
          <label className='block text-black	'>Email:</label>
          <input className='block w-full text-black border border-black p-1' type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className='mb-3'>
          <label className='block text-black	'>Payment Method:</label>
          <div className='flex flex-col flex-wrap content-start mt-5'>
            {processors.length === 0 ? (
             <> <p>No processors available.</p></>
            ) : (
              processors.map((item, index) => (
                
               
              <button className={activeButtonIndex === index ? "bg-slate-200 flex flex-row justify-evenly items-center flex-nowrap w-full	h-10" : "bg-white	flex flex-row justify-evenly items-center flex-nowrap w-full	h-10"}
                key={index} onClick={(e) => {e.preventDefault();setFormData({ ...formData, typeOfBank: item.procId }); setActiveButtonIndex(index)}} >
                <Image src={item.logo} alt={item.shortName} width={80} height={80} key={index}  className='m-auto block rounded-md' />
                {/* <label className='block text-black' key={index}>{item.shortName}</label> */}
              </button>

              ))
            )}
          </div>
        </div>
        <button className='block w-full text-white p-1 bg-red-700 mt-6' type="submit">Pay</button>
 
      </form>
    </div>
  );
};

export default Home;
