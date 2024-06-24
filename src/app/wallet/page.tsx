'use client'; 
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/dragonpay.webp';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface PayoutProcessor {
    procId: string;
    shortName: string; 
    logo: string;
    status: string;
    merchantFee: string;
    userFee: string;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
const Wallet = () => {
    const [openModal, setModal] = useState(false);
    const handleModal = () => {
      setModal(!openModal)
    }
    
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

    const preSelectedBank = [
    {
        procId: 'NULL',
        shortName: 'Select a Bank',
        logo: '',
        status: '',
        merchantFee: '',
        userFee: ''
    }];

    const [processors, setProcessors] = useState<PayoutProcessor[]>([]); 
    const [selected, setSelected] = useState(preSelectedBank[0]); 
  
useEffect(() => {
    const fetchProcessors = async () => {
        // setLoadingProcessors(true);
        const res = await fetch('/api/payout-processors');
        const availableProcessors = await res.json(); 
        // setLoadingProcessors(false);
        setProcessors(availableProcessors);  
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
            <h1>Wallet</h1>
            
            <button type="button"
            onClick={handleModal} className="flex items-center justify-center text-base font-semibold h-10 rounded px-4 border transition outline-none !text-white bg-red-500 text-secondary border-secondary hover:brightness-110 hover:!bg-secondary focus:brightness-110 focus:ring-2 ring-secondary w-full">
                Send to Bank Account
            </button>

            {openModal &&
            <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex justify-center items-center'>
                <div className='flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70'>
                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                        <h3 className="font-bold text-red-500 dark:text-white">
                            Send to Bank Account
                        </h3>
                        <button type="button" className="text-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Close" onClick={handleModal}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className='clip-rule fill-rule'
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    ></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div className='p-6 pt-0'>
                    <form className='md:w-96 px-3 m-auto p-6 mt-6 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' onKeyDown={(e) => checkKeyDown(e)} onSubmit={handleSubmit}>
            
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
                            <label className="uppercase mb-4 text-gray-800 text-sm">Bank Name:</label>
                            <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                                <>
                                {/* <Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Label> */}
                                <div className="relative mt-2">
                                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center"> 
                                        <span className="ml-3 block truncate">{selected.shortName}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                    </ListboxButton>

                                    <ListboxOptions
                                    transition
                                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                    >
                                    {processors.filter((x)=> !(['GCSH','PYMY','GRPY','BITC','TYME','TRMY','TNIK','SPAY','SMRT'].includes(x.procId))).map((item, index) => (
                                        <ListboxOption
                                        key={index}
                                        className={({ focus }) =>
                                            classNames(
                                            focus ? 'bg-indigo-600 text-white' : '',
                                            !focus ? 'text-gray-900' : '',
                                            'relative cursor-default select-none py-2 pl-3 pr-9',
                                            )
                                        }
                                        value={item}
                                        >
                                        {({ selected, focus }) => (
                                            <>
                                            <div className="flex items-center">
                                                {/* <img src={item.logo} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                {item.shortName}
                                                </span>
                                            </div>

                                            {selected ? (
                                                <span
                                                className={classNames(
                                                    focus ? 'text-white' : 'text-indigo-600',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                )}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                            </>
                                        )}
                                        </ListboxOption>
                                    ))}
                                    </ListboxOptions>
                                </div>
                                </>
                            )}
                            </Listbox>
                           
                        </div>
                    </form>
                    </div> 
                </div>
            </div>
            }

            <button type="button" className="flex items-center justify-center text-base font-semibold h-10 rounded px-4 border transition outline-none !text-white bg-red-500 text-secondary border-secondary hover:brightness-110 hover:!bg-secondary focus:brightness-110 focus:ring-2 ring-secondary w-full">
                Send to Wallet
            </button>
        </section>
        </div>
    </div>
  )
}

export default Wallet