'use client'; 
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/dragonpay.webp';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
interface PayoutProcessor {
    procId: string;
    shortName: string; 
    logo: string;
    status: string;
    merchantFee: string;
    userFee: string;
}

interface PayoutResponse {
    txnid: string;
    name: string;
    refNo: string;
    email: string;
    bank: string;
    amount: string | number;
    error?: string;
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
    const [payoutModal, setPayoutModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
    const [walletBalance, setWalletBalance] = useState(0);

    const [tFetching, setTFetching] = useState(true);
    const [transactions, setTransactions] = useState<any[][]>([[]]);
    const [dates, setDates] = useState({
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date())
    })

    const [returnPayout, setReturnPayout] = useState<PayoutResponse>({
        txnid: '',
        name: '',
        refNo: '',
        email: '',
        bank: '',
        amount: '',
    });
 
    const [page, setPage] = useState(0);


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
    fetchBalance();


    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await axios.get(`/api/transactions?startdate=${dates.startDate}&enddate=${dates.endDate}`);
            console.log(response)
            if (response.status === 200) {
                setTFetching(false)
                const paginatedTransactions = chunkArray(response.data, 10);
                setTransactions(paginatedTransactions);
            }
        }

        fetchTransactions();

    }, [dates])

    function formatDate(date: string | Date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    function chunkArray(array: Array<any>, size: number) {
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
          chunked.push(array.slice(i, size + i));
        }
        return chunked;
      }

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

 const handleListBox = (e: PayoutProcessor) => {
    setSelected(e);
    setFormData({ ...formData, procId: e.procId });
 }

 const mobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sendType == 'wallet') {
        setFormData({ ...formData, mobileNo:  e.target.value }) 
    }
 }
//  
  const requestPayout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true); 
    
    try {
        const response = await axios.post('/api/request-payout', formData);
        console.log(response);
        setSubmitting(false);
        const data = response.data;
        if (response.status === 200) {
            if (response.data.error) {
                setReturnPayout(data);
                setPayoutModal(true);
                setModal(!openModal);
            } else {
                setReturnPayout(data);
                setPayoutModal(true);
                console.log("Payout Reference No:", data);
                setModal(!openModal);
            }
            
        } else {
          console.error('Invalid response from server:', response.data);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
      }
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
                        <form className='md:w-96 px-3 m-auto p-6 mt-3 w-full border-.5 border-drag-gray-300 rounded-md divide-y-.5 divide-gray-300 bg-zinc-50' onKeyDown={(e) => checkKeyDown(e)} onSubmit={requestPayout}>
                
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
                                <label className="uppercase mb-4 text-gray-800 text-sm">{sendType == 'bank'? 'Bank Name': 'E-wallet'}</label>
                                <Listbox value={selected} onChange={handleListBox} >
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

                            <div className='mb-3'>
                                <label className='uppercase mb-4 text-gray-800 text-sm'>{sendType == 'wallet' ? 'Mobile No': 'Account No'}.:</label>
                                <input className='block w-full text-gray-900 border border-gray-200 p-1 rounded-md' type="number" name="procDetail" value={formData.procDetail} onChange={handleChange} onBlur={mobileChange} required />
                            </div>

                            {/* button */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit" className="flex items-center justify-center text-base font-semibold h-10 rounded px-4 border transition outline-none !text-white bg-red-500 text-secondary border-secondary hover:brightness-110 hover:!bg-secondary focus:brightness-110 focus:ring-2 ring-secondary w-48">
                                    Pay Now
                                </button>
                            </div>    
                        </form>
                        </div> 
                    </div>
                </div>
            }
            { payoutModal && 
                <div className='fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-10'>
                    <div className='w-1/4 h-2/4 bg-white rounded-md flex flex-col items-center px-8 pb-8'>
                        <div className="w-full flex justify-end items-center py-3 px-4 ">
                           
                            <button type="button" className="text-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Close" onClick={()=> setPayoutModal(false)} >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path className='clip-rule fill-rule'
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        ></path>
                                </svg>
                            </button>
                        </div>
                        { !returnPayout.error ? 
                            <div className='w-full flex flex-col h-full justify-between items-center'>
                                <div className='flex flex-col  items-center'>
                                    <svg width="64px" height="64px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fill-opacity="0.01"></rect> <path d="M24 4L29.2533 7.83204L35.7557 7.81966L37.7533 14.0077L43.0211 17.8197L41 24L43.0211 30.1803L37.7533 33.9923L35.7557 40.1803L29.2533 40.168L24 44L18.7467 40.168L12.2443 40.1803L10.2467 33.9923L4.97887 30.1803L7 24L4.97887 17.8197L10.2467 14.0077L12.2443 7.81966L18.7467 7.83204L24 4Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 24L22 29L32 19" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <h2 className='text-2xl font-bold mt-4'>Transfer Requested!</h2>
                                </div>
                                
                                <div className='w-full'>
                                    <p>Ref No: { returnPayout.refNo }</p>
                                    <p>TXN ID: { returnPayout.txnid }</p>
                                    <p>Name: { returnPayout.name }</p>
                                    <p>Email: { returnPayout.email }</p>
                                    <p>Bank: { returnPayout.bank }</p>
                                    <p>Amount: { returnPayout.amount }</p>
                                </div>
                                <button className="bg-red-500 text-white px-5 py-2 rounded-md" onClick={() => setPayoutModal(false)}>OK</button>
                            </div>
                            :
                            <div className='flex flex-col h-full justify-center items-center'>
                                <div className='flex flex-col  items-center'>
                                    <svg width="64px" height="64px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fill-opacity="0.01"></rect> <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <h2 className='text-2xl font-bold mb-4'>Transfer Request Failed!</h2>
                                    <p className='text-center mb-6'>{returnPayout.error}</p>
                                </div>
                                <button className="bg-red-500 text-white px-5 py-2 rounded-md" onClick={() => setPayoutModal(false)}>OK</button>
                            </div>
                        }
                        
                    </div>
                </div>
            }
        </section>

        <section className="pb-12">
            <div className="flex justify-between items-center mb-6">
                <h3 className='mb-3 text-4xl font-bold'>Transactions</h3>
                <div className='flex gap-2 '>
                    <input type='date' value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })}  />
                    <input type='date' value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />
                </div>
            </div>
            { !tFetching ? 
                <>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th>Ref No.</th>
                                <th>TXN ID</th>
                                <th>Bank</th>
                                <th>Date</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            { transactions[page].length > 0 && transactions[page].map((transaction: any) => (
                                <tr key={transaction.RefNo}>
                                    <th>{transaction.RefNo}</th>
                                    <th>{transaction.TxnId}</th>
                                    <th>{transaction.ProcId}</th>
                                    <th>{formatDate(transaction.RefDate)}</th>
                                    <th>{transaction.Email}</th>
                                    <th>{transaction.Status}</th>
                                    <th>{transaction.Description}</th>
                                    <th>{transaction.Amount}</th>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                    { transactions.length > 1 && <div className='flex gap-2 justify-center w-full mt-6'>{ transactions.map((transactionIndex, index) => (
                        <a onClick={() => setPage(index)} className={`p-4 py-2 ${index === page ? 'bg-red-500' : 'bg-red-200' }`} key={index + Math.random()}>{ index + 1 }</a>
                    ))}</div> }
                </>
            : 
                <div role="status" className="grid place-items-center w-full h-9">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            }
        </section>
        </div>
    </div>
  )
}

export default Wallet