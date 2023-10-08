import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

const PendingInvoice: React.FC<{ request: any }> = ({ request }) => {
  const { address } = useAccount();

  const background = request.payer.value === address ? "bg-yellow-100" : "bg-white";

  return (
    <div className={`${background} p-4 rounded-lg shadow-md text-center space-y-5 w-64 m-4`}>
      <Link href={`/invoices/${request.requestId}`}>
        <h1 className="text-center font-bold text-lg my-2">{request.contentData.reason}</h1>
        <p className="text-sm my-1">
          <b>Date: </b> {request.contentData.dueDate}
        </p>
        <p className="text-sm my-1">
          <b>Payer: </b>
          {request.payer?.value.slice(0, 5)}...
          {request.payer?.value.slice(39, 42)}
        </p>
        <p className="text-sm my-1">
          <b>Amount: </b>
          {request.expectedAmount}
        </p>
        <p className="text-sm my-1">
          <b>Invoice ID: </b>
          {request.requestId.slice(0, 4)}...
          {request.requestId.slice(62, 66)}
        </p>
      </Link>
    </div>
  );
};

export default PendingInvoice;
