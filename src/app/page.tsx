"use client"; // This marks the file as a Client Component

import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({
    amount: 10,
    description: 'My order description.',
    email: 'goldie@fullstack.ph',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
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
      if (error.response) {
        console.error('Error response from server:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server:', error.request);
      } else {
        console.error('Error in setting up request:', error.message);
      }
      // Display appropriate error message to the user
    }
  };

  return (
    <div className='pt-8 w-1/2 block m-auto'>
      <h1>Dragonpay Payment</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label className='block'>Amount:</label>
          <input className='text-black' type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className='mb-6'>
          <label className='block'>Description:</label>
          <input className='text-black' type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className='mb-6'>
          <label className='block'>Email:</label>
          <input className='text-black' type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default Home;
