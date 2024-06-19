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
    typeOfBank: '',
    currency: 'PHP'
  });
  const [processors, setProcessors] = useState<Processor[]>([]);
  const [activeButtonIndex, setActiveButtonIndex] = useState('');
  const [loadingProcessors, setLoadingProcessors] = useState(false);

  useEffect(() => {
    const fetchProcessors = async () => {
      setLoadingProcessors(true);
      const res = await fetch('/api/processors');
      const availableProcessors = await res.json(); 
      setLoadingProcessors(false);
      setProcessors(availableProcessors); 
    };
    fetchProcessors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(formData); 
  // console.log(activeButtonIndex);

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
          <form className='border border-black md:w-96 px-3	 m-auto p-6 mt-6 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' onSubmit={handleSubmit}>
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
              {
                  loadingProcessors &&   
                  <div className='px-10 pt-0 sm:px-0 sm:py-3 flex justify-center'>
                    <div className="text-center">
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                  </div>
                }
                {
                  !loadingProcessors && 
                  <div className='px-10 pt-0 pb-3 sm:px-0 sm:py-3 flex justify-center'>
                    <ul className="w-full flex flex-wrap sm:-mx-2">
                      {processors.length === 0 ? (
                      <> <li className='sm:px-0.5 w-full sm:w-1/3 sm:pb-4 text-gray-800 '>No processors available.</li></>
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
                }  
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
