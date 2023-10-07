import React, { useEffect, useState } from 'react';
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

import { formatUnits } from "viem";
import { useAccount } from 'wagmi';
import PendingInvoice from '~~/components/PendingInvoice';

// EDIT THIS TO SELECT THE USER'S ADDRESS



const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('pendingInvoices');

const {address} = useAccount();
  //get all history

  const [totalRequestHistory, SetTotalRequestHistory] =
  useState<(Types.IRequestDataWithEvents | undefined)[]>();
useEffect(() => {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://xdai.gateway.request.network/",
    },
  });
  requestClient
    .fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: address as string,
    })
    .then((requests) => {
        SetTotalRequestHistory(requests.map((request) => request.getData()));
    });
}, [address, activeButton]);

const calculateStatus = (
    state: string,
    expectedAmount: bigint,
    balance: bigint
  ) => {
    if (balance >= expectedAmount) {
      return "Paid";
    }
    if (state === Types.RequestLogic.STATE.ACCEPTED) {
      return "Accepted";
    } else if (state === Types.RequestLogic.STATE.CANCELED) {
      return "Canceled";
    } else if (state === Types.RequestLogic.STATE.CREATED) {
      return "Created";
    } else if (state === Types.RequestLogic.STATE.PENDING) {
      return "Pending";
    }
  };
  //set totalHistory to results
  //filter results based on request.balance.balance 
  //if request.balance.balance > 0 => !pendingInvoice

  return (
    <div>
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
    {activeButton === "transactionHistory" &&
  <div className="App p-8 bg-gray-100 min-h-screen">
  <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
    <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Request ID</th>
              <th>Payer</th>
              <th>Currency</th>
              <th>Expected Amount</th>
              <th>Reason</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
          {totalRequestHistory
  ?.filter((request : any)  => {
    return calculateStatus(
      request.state,
      BigInt(request.expectedAmount),
      BigInt(request.balance?.balance || 0)
    ) === "Paid";
  })
  .map((request: any) => (
    <tr key={request.timestamp}>
      <td>{request.timestamp}</td>

      <td >
        {request.requestId.slice(0, 4)}...
        {request.requestId.slice(62, 66)}
      </td>
      <td>
        {request.payer?.value.slice(0, 5)}...
        {request.payer?.value.slice(39, 42)}
      </td>
      <td>{request.currency}</td>
      <td>{formatUnits(BigInt(request.expectedAmount), 18)}</td>
      <td>{request.contentData.reason}</td>
      <td>{request.contentData.dueDate}</td>
      <td>
        {calculateStatus(
          request.state,
          BigInt(request.expectedAmount),
          BigInt(request.balance?.balance || 0)
        )}
      </td>
      <td>{formatUnits(BigInt(request.balance?.balance || 0), 18)}</td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
  

     
    </div>
    }

{activeButton === "pendingInvoices" &&
  <div className="App p-8 bg-gray-100 min-h-screen">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* You must pay column */}
      <div>
        <h2 className="text-xl font-bold mb-4">You must pay</h2>
        <div className="grid grid-cols-1 gap-4">
          {totalRequestHistory
            ?.filter((request: any) => {
              return calculateStatus(
                request.state,
                BigInt(request.expectedAmount),
                BigInt(request.balance?.balance || 0)
              ) !== "Paid" && request?.payer.value === address;
            })
            .map((request: any) => (
              <PendingInvoice request={request} key={request.timestamp} />
            ))}
        </div>
      </div>

      {/* You must be paid column */}
      <div>
        <h2 className="text-xl font-bold mb-4">You must be paid</h2>
        <div className="grid grid-cols-1 gap-4">
          {totalRequestHistory
            ?.filter((request: any) => {
              return calculateStatus(
                request.state,
                BigInt(request.expectedAmount),
                BigInt(request.balance?.balance || 0)
              ) !== "Paid" && request?.payer.value !== address;
            })
            .map((request: any) => (
              <PendingInvoice request={request} key={request.timestamp} />
            ))}
        </div>
      </div>
    </div>
  </div>
}


  
    </div>
  );
}

export default Dashboard;
