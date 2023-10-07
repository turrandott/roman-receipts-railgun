import React, { useEffect, useState } from 'react';
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

import { formatUnits } from "viem";

// EDIT THIS TO SELECT THE USER'S ADDRESS
const userAddress = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";


const Profile = () => {
  const [activeButton, setActiveButton] = useState('');


  //get all history

  const [requests, setRequests] =
  useState<(Types.IRequestDataWithEvents | undefined)[]>();
useEffect(() => {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://goerli.gateway.request.network/",
    },
  });
  requestClient
    .fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: userAddress,
    })
    .then((requests) => {
      setRequests(requests.map((request) => request.getData()));
    });
}, []);


  //set totalHistory to results
  //filter results based on request.balance.balance 
  //if request.balance.balance > 0 => !pendingInvoice

  return (
    <div className="p-4">
      <button
        className={`mr-4 py-2 px-4 border rounded ${activeButton === 'pendingInvoices' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => setActiveButton('pendingInvoices')}
      >
        Pending Invoices
      </button>

      <button
        className={`py-2 px-4 border rounded ${activeButton === 'transactionHistory' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => setActiveButton('transactionHistory')}
      >
        Transaction History
      </button>
    </div>
  );
}

export default Profile;
