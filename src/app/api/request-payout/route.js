// server/api/request-payment.ts
import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { firstName, middleName, lastName, amount, currency, description, procId, procDetail, email, mobileNo, birthDate, address} = await req.json();

    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const apiKey = process.env.DRAGONPAY_APIKEY;
    const baseUrl = process.env.DRAGONPAY_PAYOUT_TEST_URL;
    const txnid = `txn${Date.now()}`;
    const dateNow = new Date();
    const rundate = dateNow.toISOString().split('T')[0];
   
    if (!merchantId || !password || !baseUrl) {
      throw new Error('Missing environment variables');
    }

    const payload = {
      TxnId: txnid, 
      FirstName: firstName,
      MiddleName: middleName,
      LastName: lastName,
      Amount: amount,
      Currency: currency,
      Description: description,
      ProcId: procId,
      ProcDetail: procDetail,
      RunDate: rundate,
      Email: email,
      MobileNo: mobileNo,
      BirthDate: birthDate,
      Nationality: "Philippines",
      Address:
        {
          Street1: address.street1,
          Street2: address.street2,
          Barangay: address.barangay,
          City : address.city,
          Province: address.province,
          Country: "PH"
        }
    };
   // sample payload
    // const payload = {
    //   TxnId: txnid, 
    //   FirstName: "Veronica",
    //   MiddleName: "B",
    //   LastName: "Dacpano",
    //   Amount: "2500",
    //   Currency: "PHP",
    //   Description: "Testing JSON payout",
    //   ProcId: "CEBL",
    //   ProcDetail: "sample@dragonpay.ph",
    //   RunDate: rundate,
    //   Email: "sample@dragonpay.ph",
    //   MobileNo: "",//09175281679
    //   BirthDate: "",//1970-11-17
    //   Nationality: "Philippines",
    //   Address:
    //     {
    //       Street1: "123 Sesame Street",
    //       Street2: "Childrens Television Workshop",
    //       Barangay: "Ugong",
    //       City : "Pasig",
    //       Province: "Metro Manila",
    //       Country: "PH"
    //     }
    // };

    const endpoint = `${baseUrl}/${merchantId}/post`;
    console.log(payload);

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })
    .then((res) => {
      // console.log("res:",res);
      return res;
    }).catch ((error)=> {
      console.log(error);
      console.log(error.response.status, error.response.statusText);

      if (error.response.statusText)
        error = {message: error.response.statusText, status: error.response.status};  

      throw error;
    });

    console.log('Response from Dragonpay:', response.data);
    
    if (response.data.Code === 0) {
      return NextResponse.json({ 
        refNo: response.data.Message,
        txnid: txnid,
        name: `${firstName} ${middleName} ${lastName}`,
        email: email,
        number: mobileNo,
        amount: amount,
        bank: procId
       });// Payout Reference No
    } else {
      let message = 'Payout request failed'

      switch(response.data.Code) {
        case -4: message = 'Unable to create a payout transaction'; break;
        case -5: message = 'Invalid payout account details'; break;
        case -6: message = 'Cannot accept a pre-dated run date'; break;
        case -7: message = 'Amount limited exceeded'; break;
        case -8: message = 'Similar transaction id already exists'; break;
        case -9: message = 'Server IP access is not allowed'; break;
        case -10: message = 'Payout account is blacklisted'; break;
        case -11: message = 'Payout account is not enrolled for bank'; break;
      }
      
      throw new Error(message);
    }
   
  } catch (error) {
    // console.error('Error processing payment:', error);
    let status;
    if (error.status)
      status = error.status;
    return NextResponse.json({ error: error.message }, { status: status });
  }
}