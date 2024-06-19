import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const getAvailableProcessors = async () => {
  try {
    const merchantId = process.env.NEXT_PUBLIC_DRAGONPAY_MERCHANT_ID;
    const password = process.env.DRAGONPAY_PASSWORD;
    const response = await axios.get(`https://test.dragonpay.ph/api/collect/v1/processors/`, {
      headers: {
        'Content-Type':'application/json',
        Accept:'application/json'
      }, 
      // auth: {
      //   username: merchantId,
      //   password: password
      // }
    })
   ;

    console.log(response);

    console.log('Raw XML Response:', response.data);

    const parsedData = await parseStringPromise(response.data);
    console.log('Parsed Data:', parsedData);

    if (!parsedData.ArrayOfProcessorInfo || !parsedData.ArrayOfProcessorInfo.ProcessorInfo) {
      throw new Error('Malformed API response');
    }

    const processors = parsedData.ArrayOfProcessorInfo.ProcessorInfo.map(proc => ({
      procId: proc.procId[0],
      shortName: proc.shortName[0],
      longName: proc.longName[0],
      logo: proc.logo[0],
      remarks: proc.remarks[0],
    }));

    console.log('Processed Data:', processors);

    return processors;
  } catch (error) {
    console.error('Error fetching available processors:', error);
    return [];
  }
};
