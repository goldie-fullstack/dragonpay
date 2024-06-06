"use client"; // This marks the file as a Client Component

import { useState } from 'react';
import axios from 'axios';
import logo from '../../public/dragonpay.webp'
import Image from 'next/image';

const Home = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    email: '',
    typeOfBank: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/request-payment', formData);
      const { url } = response.data; // Assuming response contains { url }
      if (url) {
        window.location.href = url; // Redirect to the obtained URL
      } else {
        console.error('Invalid response from server:', response.data);
        // Handle invalid response (e.g., display error message)
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error (e.g., display error message)
    }
  };

  const bankTyp = [
    {
      ProcName: 'Metrobank',
      ProdId: 'MBTC'
    },
    {
      ProcName: 'GCASH',
      ProdId: 'GCSH'
    }
  ];
  
  return (
    <div className='pt-8 w-1/2 block m-auto'>
      <Image src={logo} alt='logo' width={350} className='m-auto block' />
      <form className='border border-black w-1/2 m-auto p-6 mt-6' onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='block'>Amount:</label>
          <input className='block w-full text-black border border-black p-1' type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className='mb-3'>
          <label className='block'>Description:</label>
          <input className='block w-full text-black border border-black p-1' type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className='mb-3'>
          <label className='block'>Email:</label>
          <input className='block w-full text-black border border-black p-1' type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button className='block w-full text-white p-1 bg-red-700 mt-6' type="submit">Pay</button>
      </form>
    </div>
  );
};

export default Home;
