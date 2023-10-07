import Link from 'next/link';
import React from 'react'
import { useAccount } from 'wagmi';

const PendingInvoice: React.FC<{ request: any }> = ({ request }) => {

    const {address} = useAccount();

    const background = request.payer.value === address 
    ? 'bg-yellow-100' : 'bg-white'

    return (
        <div className={`${background} p-4 rounded-lg shadow-md text-center space-y-5`}>
          <h1 className='text-center font-bold'>{request.contentData.reason}</h1>
          <p className="text-sm mb-2">
            <b>Date:</b> {request.contentData.dueDate}
          </p>
          <p className="text-sm mb-2">
            <b>Payer:</b>
            {request.payer?.value.slice(0, 5)}...
            {request.payer?.value.slice(39, 42)}
          </p>
          <p className="text-sm">
            <b>Request ID:</b>
            {request.requestId.slice(0, 4)}...
            {request.requestId.slice(62, 66)}
          </p>
          <Link href={`/invoices/${request.requestId}`} className='btn btn-secondary'>Go To Invoice</Link>
        </div>
      );
}

export default PendingInvoice