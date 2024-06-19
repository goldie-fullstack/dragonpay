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
  const [activeButtonIndex, setActiveButtonIndex] = useState('');

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
  
  const activeButtonHandler = (id: string) => {
    if (id == activeButtonIndex) {
      setActiveButtonIndex('');
    }
    else {
      setActiveButtonIndex(id);
    }
  }

  return (
    <div className='w-full h-full mx-auto lg:max-w-2xl flex flex-col'>

      <div className='flex-1'>
        <section className="py-8">
          <Image src={logo} alt='logo' priority={true} width={350} className='m-auto block' />
        </section>

        <section className="pb-12">
          <form className='border border-black w-72 md:w-96 m-auto p-6 mt-6 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' onSubmit={handleSubmit}>
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
              <label className="uppercase mb-4 text-gray-800 text-sm">Payment Method:</label>
              <div className='px-10 pt-0 pb-3 sm:px-0 sm:py-3 flex justify-center'>
                <ul className="w-full flex flex-wrap sm:-mx-2">
                  {processors.length === 0 ? (
                  <> <li>No processors available.</li></>
                  ) : (
                    processors.map((item, index) => (
                      
                    <li className="sm:px-0.5 w-full sm:w-1/3 sm:pb-4" key={index} >
                      <button 
                      className='w-full group p-1.5 sm:p-0 flex items-center space-x-3 text-left focus:bg-gray-300 border-drag-gray-300  transition-colors outline-none'
                        onClick={(e) => {e.preventDefault();setFormData({ ...formData, typeOfBank: item.procId }); activeButtonHandler(item.procId)}} >
                          
                          {/* <div className={activeButtonIndex === item.procId ? "flex items-center justify-center border border-red-500 sm:rounded ring-red-500 transition px-3 h-10 sm:h-24 w-20 sm:w-full space-y-1.5 bg-white hover:border-red-500 sm:focus:ring-2":"flex items-center justify-center border border-drag-gray-300 sm:rounded ring-red-500 transition px-3 h-10 sm:h-24 w-20 sm:w-full space-y-1.5 bg-white group-hover:border-primary sm:group-focus:ring-2"}> */}
                          <div className={activeButtonIndex === item.procId ? "flex items-center justify-center border border-red-500 sm:rounded ring-red-200 transition px-3 h-10 sm:h-24 w-20 sm:w-full space-y-1.5 bg-white hover:border-red-500 sm:group-focus:ring-2": "flex items-center justify-center border border-drag-gray-300 sm:rounded ring-red-200 transition px-3 h-10 sm:h-24 w-20 sm:w-full space-y-1.5 bg-white hover:border-red-500 sm:group-focus:ring-2"}>
                            <Image src={item.logo} alt={item.shortName} width={100} height={100} key={index}  className='object-contain h-5 sm:h-12' />
                        </div> 
                        <span className="sm:hidden text-base text-gray-800 flex-1">{item.shortName}</span>
                      </button>
                      </li>
                    ))
                  )}
                  </ul>
              </div>
            </div> 
            <div className="pt-4 flex justify-center">
              <button type="submit" className="flex items-center justify-center text-base font-semibold h-10 rounded px-4 border transition outline-none !text-white bg-red-500 text-secondary border-secondary hover:brightness-110 hover:!bg-secondary focus:brightness-110 focus:ring-2 ring-secondary w-48">
                Pay Now
              </button>
            </div>
    
          </form>
        </section>
       
        
      </div>

    </div>
  );
};

export default Home;
