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
    const [processors, setProcessors] = useState<PayoutProcessor[]>([]); 
    const [filteredProcessors, setFilteredProcessors] = useState<PayoutProcessor[]>([]);  
    const [selected, setSelected] = useState({
        procId: 'NULL',
        shortName: '',
        logo: '',
        status: '',
        merchantFee: '',
        userFee: ''    
    }); 
    const [sendType, setSendType] = useState('');
    const [openModal, setModal] = useState(false);
    const walletIds = ['GCSH','PYMY','GRPY','BITC','TYME','TRMY','TNIK','SPAY','SMRT'];

    const formFields = {
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
        address: {//(optional)
          street1: '',
          street2: '',
          barangay:'',
          city: '',
          province:'',
          country: ''
        },
    };
    
    const [formData, setFormData] = useState(formFields);
    const [walletBalance, setWalletBalance] = useState(1000);

    // console.log(selected);
    useEffect(() => {
        const fetchProcessors = async () => {
            // setLoadingProcessors(true);
            const res = await fetch('/api/payout-processors');
            const availableProcessors = await res.json(); 
            // setLoadingProcessors(false);
            setProcessors(availableProcessors);  
        };
     fetchProcessors();
 
    const fetchBalance = async () => {
        // setLoadingProcessors(true);
        const res = await fetch('/api/ledger-balance');
        const balance = await res.json(); 
        console.log(balance);
        // setLoadingProcessors(false);
        setWalletBalance(balance);  
    };
    // fetchBalance();
    }, []);

    const handleModal = (type: string) => {
        setSendType(type);
        
        if (type == 'bank') {
            const bank = processors.filter((x)=> !(walletIds.includes(x.procId)));
            setSelected({...selected, shortName: 'Select a Bank'});
            setFilteredProcessors(bank);
        }
        else if (type == 'wallet') {
            const wallet = processors.filter((x)=> (walletIds.includes(x.procId)));
            setSelected({...selected, shortName: 'Select an e-wallet'});
            setFilteredProcessors(wallet);
        }
        setFormData(formFields);// reset fields values
        setModal(!openModal);
      }
      

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
    <div className='w-full h-full mx-auto lg:max-w-5xl flex flex-col'>

        <div className='flex-1 css-wallet-container'>
        
        <section className="py-8">
            <Image src={logo} alt='logo' priority={true} width={350} className='m-auto block' />
        </section>

        <section className="pb-12">
            <h3 className='mb-3 text-4xl font-bold'>Wallet</h3>
            
            <div className="h-100 p-8 bg-white rounded-[20px] shadow-[0_15px_46px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center h-full justify-between md:flex-row">
                    <div className="flex flex-col justify-end">
                        <div className="flex">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 mr-1.5">
                            <path d="M1 4.25a3.733 3.733 0 0 1 2.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0 0 16.75 2H3.25A2.25 2.25 0 0 0 1 4.25ZM1 7.25a3.733 3.733 0 0 1 2.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0 0 16.75 5H3.25A2.25 2.25 0 0 0 1 7.25ZM7 8a1 1 0 0 1 1 1 2 2 0 1 0 4 0 1 1 0 0 1 1-1h3.75A2.25 2.25 0 0 1 19 10.25v5.5A2.25 2.25 0 0 1 16.75 18H3.25A2.25 2.25 0 0 1 1 15.75v-5.5A2.25 2.25 0 0 1 3.25 8H7Z" />
                        </svg>

                            <h4 className="text-sm font-bold uppercase">Balance</h4>

                        </div>
                        <div className="flex flex-col items-start md:flex-row md:items-end">
                            <p className="text-4xl font-bold ">{walletBalance.toLocaleString("en-US", {style:"currency", currency:"PHP"})}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-5">

                        {/* <button type="button" className="chakra-button css-1l7kpaq">
                           Send to bank account</button>
                        <button type="button" className="chakra-button css-1l7kpaq">
                            Send to e-wallet</button> */}

                        <button type="button"
                        onClick={(e)=> handleModal('bank')} 
                        className="sm:whitespace-nowrap	sm:w-auto inline-flex bg-red-500 appearance-none items-center justify-center select-none relative whitespace-pre-wrap align-middle outline-none w-full	leading-none rounded font-semibold transition duration-200 h-14 min-w-12 text-[15px] ps-6 pe-6 text-white cursor-pointer pt-2.5	pb-2.5	">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M7.605 2.112a.75.75 0 0 1 .79 0l5.25 3.25A.75.75 0 0 1 13 6.707V12.5h.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H3V6.707a.75.75 0 0 1-.645-1.345l5.25-3.25ZM4.5 8.75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3ZM8 8a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 8 8Zm2 .75a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3ZM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>

                            Send to Bank Account
                        </button>

                        <button type="button" 
                        onClick={(e)=> handleModal('wallet')} 
                        className="sm:whitespace-nowrap	sm:w-auto inline-flex bg-red-500 appearance-none items-center justify-center select-none relative whitespace-pre-wrap align-middle outline-none w-full	leading-none rounded font-semibold transition duration-200 h-14 min-w-12 text-[15px] ps-6 pe-6 text-white cursor-pointer pt-2.5	pb-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v.401a2.986 2.986 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401V3.5ZM3.5 5A1.5 1.5 0 0 0 2 6.5v.401A2.986 2.986 0 0 1 3.5 6.5h9c.546 0 1.059.146 1.5.401V6.5A1.5 1.5 0 0 0 12.5 5h-9ZM8 10a2 2 0 0 0 1.938-1.505c.068-.268.286-.495.562-.495h2A1.5 1.5 0 0 1 14 9.5v3a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-3A1.5 1.5 0 0 1 3.5 8h2c.276 0 .494.227.562.495A2 2 0 0 0 8 10Z" />
                        </svg>
                            Send to Wallet
                        </button>

                    </div>
                </div>
            </div>
           
            
            {openModal &&
            <div className='fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center'>
                <div className='flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto light:bg-neutral-800 light:border-neutral-700 dark:shadow-neutral-700/70'>
                    <div className="flex justify-between items-center py-3 px-4 border-b light:border-neutral-700">
                        <h3 className="font-bold text-red-500 light:text-white">
                            Send to {sendType == 'bank'?'Bank Account' :'E-wallet'}
                        </h3>
                        <button type="button" className="text-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Close" onClick={(e)=> handleModal('')} >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className='clip-rule fill-rule'
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    ></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div className='p-6 pt-0'>
                    <form className='md:w-96 px-3 m-auto p-6 mt-3 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' onKeyDown={(e) => checkKeyDown(e)} onSubmit={handleSubmit}>
            
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
                            <label className="uppercase mb-4 text-gray-800 text-sm">{sendType == 'bank'? 'Bank Name': 'E-wallet'}</label>
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
                                    {filteredProcessors.map((item, index) => (
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
        </section>
        </div>
    </div>
  )
}

export default Wallet