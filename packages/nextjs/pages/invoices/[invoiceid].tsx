"use client";

import { useEffect, useState } from "react";
import { abi as azuroAbi } from "../../generated/azuroDouble.json";
import Link from "next/link";
import { useRouter } from "next/router";
import { currencies } from "../../config/currency";
import { storageChains } from "../../config/storage-chain";
import { useEthersV5Provider } from "../../hooks/ethers/use-ethers-v5-provider";
import { useEthersV5Signer } from "../../hooks/ethers/use-ethers-v5-signer";
import styles from "@/app/page.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
import { approveErc20, hasErc20Approval, hasSufficientFunds, payRequest } from "@requestnetwork/payment-processor";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useNetwork, useSwitchNetwork, useWalletClient, useContractWrite  } from "wagmi";

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


enum APP_STATUS {
  AWAITING_INPUT = "awaiting input",
  SUBMITTING = "submitting",
  PERSISTING_TO_IPFS = "persisting to ipfs",
  PERSISTING_ON_CHAIN = "persisting on-chain",
  REQUEST_CONFIRMED = "request confirmed",
  APPROVING = "approving",
  APPROVED = "approved",
  PAYING = "paying",
  REQUEST_PAID = "request paid",
  PAYMENT_ACCEPTED = "payment accepted",
  ERROR_OCCURRED = "error occurred",
}

export default function Home() {
  const [storageChain, setStorageChain] = useState("5");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [currency, setCurrency] = useState("5_0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc");
  const [confirmationDigits, setConfirmationDigits] = useState("");

  const router = useRouter();
  const { invoiceid } = router.query;

  const [paymentRecipient, setPaymentRecipient] = useState("");
  const [payerIdentity, setPayerIdentity] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(APP_STATUS.AWAITING_INPUT);
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading: isSwitchNetworkLoading, switchNetwork } = useSwitchNetwork();
  const [requestData, setRequestData] = useState<Types.IRequestDataWithEvents>();
  const provider = useEthersV5Provider();
  const signer = useEthersV5Signer();
  const { write: bet } = useContractWrite({
    abi: azuroAbi,
    address: '0xA68fdE7b2bA954c2CECBFb045BcA7be16C782535',
    functionName: "bet",
  });
  const { write: betPayout } = useContractWrite({
    abi: azuroAbi,
    address: '0xA68fdE7b2bA954c2CECBFb045BcA7be16C782535',
    functionName: "betPayout",
  });

  

  useEffect(() => {
    console.log(invoiceid);
  }, []);

  useEffect(() => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://goerli.gateway.request.network/",
      },
    });
    requestClient.fromRequestId(invoiceid as string).then(request => {
      setRequestData(request.getData());
      console.log(request.getData());
    });
  }, [address, invoiceid]);

  async function payTheRequest() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
    });

    try {
      const _request = await requestClient.fromRequestId(requestData!.requestId);
      let _requestData = _request.getData();
      const paymentTx = await payRequest(_requestData, signer);
      await paymentTx.wait(2);

      // Poll the request balance once every second until payment is detected
      // TODO Add a timeout
      while (_requestData.balance?.balance! < _requestData.expectedAmount) {
        _requestData = await _request.refresh();
        alert(`balance = ${_requestData.balance?.balance}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      alert(`payment detected!`);
      setRequestData(_requestData);
      setStatus(APP_STATUS.REQUEST_PAID);
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }
  }

  async function doubleYourIncome() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
    });

    const _request = await requestClient.fromRequestId(requestData!.requestId);
    let _requestData = _request.getData();
    try {
      while (_requestData.state != Types.RequestLogic.STATE.ACCEPTED) {
        acceptPayment()
      }

      const amount = _requestData.balance?.balance!;
      let doublingTx = bet({args: [amount]});
      


      // Poll the request balance once every second until payment is detected
      // TODO Add a timeout
      while (_requestData.balance?.balance! < _requestData.expectedAmount) {
        _requestData = await _request.refresh();
        alert(`balance = ${_requestData.balance?.balance}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      alert(`payment detected!`);
      setRequestData(_requestData);
      setStatus(APP_STATUS.REQUEST_PAID);
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }
  }

  async function acceptPayment() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
    });

    try {
      const _request = await requestClient.fromRequestId(requestData!.requestId);
      let _requestData = _request.getData();

    const ETHEREUM_ADDRESS = "ethereumAddress"
   const   ETHEREUM_SMART_CONTRACT = "ethereumSmartContract"


      const identity = {
        type: ETHEREUM_ADDRESS,
        value: requestData?.payee?.value
      }
//@ts-ignore
      const declareReceivedTx = await _request.declareReceivedPayment(_requestData.balance?.balance!, "thank you", requestData?.payee)
      console.log(declareReceivedTx)
      while (_requestData.state != Types.RequestLogic.STATE.ACCEPTED) {
        _requestData = await _request.refresh();
        alert(`state = ${_requestData.state}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      alert(`payment accepted!`);
      setRequestData(_requestData);
      setStatus(APP_STATUS.PAYMENT_ACCEPTED);
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      console.log
      alert(err);
    }
  }



  function handlePay(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    //@ts-ignore
    document.getElementById('confirmation_modal').showModal();
  }

  function handleAcceptPayment(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setStatus(APP_STATUS.PAYING);
    acceptPayment();
  }

  async function approve() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
    });

    try {
      const _request = await requestClient.fromRequestId(requestData!.requestId);
      const _requestData = _request.getData();
      alert(`Checking if payer has sufficient funds...`);
      const _hasSufficientFunds = await hasSufficientFunds(_requestData, address as string, { provider: provider });
      alert(`_hasSufficientFunds = ${_hasSufficientFunds}`);
      if (!_hasSufficientFunds) {
        setStatus(APP_STATUS.REQUEST_CONFIRMED);
        return;
      }
      if (
        getPaymentNetworkExtension(_requestData)?.id === Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
      ) {
        alert(`ERC20 Request detected. Checking approval...`);
        const _hasErc20Approval = await hasErc20Approval(_requestData, address as string, provider);
        alert(`_hasErc20Approval = ${_hasErc20Approval}`);
        if (!_hasErc20Approval) {
          const approvalTx = await approveErc20(_requestData, signer);
          await approvalTx.wait(2);
        }
      }
      setStatus(APP_STATUS.APPROVED);
    } catch (err) {
      setStatus(APP_STATUS.REQUEST_CONFIRMED);
      alert(JSON.stringify(err));
    }
  }

  function handleApprove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setStatus(APP_STATUS.APPROVING);
    approve();
  }










  function handleConfirmation() {
    //@ts-ignore
    if (confirmationDigits === address.slice(-6)) {  // Check if the last 6 digits match
      //@ts-ignore
      document.getElementById('confirmation_modal').close();  // Close the modal
      setStatus(APP_STATUS.PAYING);
      payTheRequest();  // Continue with the payment process
    } else {
      // Handle the error, for example, by showing an alert or updating the state to show an error message
      alert("The digits entered do not match. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-4/5 md:w-1/2 rounded-2xl mt-12">
        <h3 className="text-center text-xl font-bold mb-4">Invoice</h3>
        <p className="text-xs hidden lg:block">Invoice id: {invoiceid?.slice(0, 12) + '...' + invoiceid?.slice(59,65)}</p>
        <p className="text-xs block lg:hidden">Invoice id: {invoiceid}</p>
        <div className="flex justify-between mb-2">
            <span className="font-medium">From:</span>
        
        
            <span className="hidden lg:block">
            {requestData?.payee?.value}
            </span>
            <span className="block lg:hidden">
            {requestData?.payee?.value.slice(0,5) + '...' + requestData?.payee?.value.slice(35,41)}
            </span>
         
        </div>

        <div className="flex justify-between mb-2">
            <span className="font-medium">To:</span>
     
            <span className="hidden lg:block">
            {requestData?.payer?.value}
            </span>
            <span className="block lg:hidden">
            {requestData?.payer?.value.slice(0,5) + '...' + requestData?.payee?.value.slice(35,41)}
            </span> {/* Assuming this is correct, but you may want to adjust this if "To" and "From" values are different */}
        </div>

        <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span>{requestData?.expectedAmount ? formatUnits(BigInt(requestData?.expectedAmount as any), 18) : null}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-medium">Reason:</span>
            <span>{requestData?.contentData.reason}</span>
        </div>

        <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span>
            {requestData && calculateStatus(
          requestData?.state as any,
          BigInt(requestData?.expectedAmount as any),
          BigInt(requestData?.balance?.balance || 0)
        ) }
            </span>
        </div>


      
      
        { requestData?.payer?.value === address ? 

        <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">
                <span>Get FAU on Goerli using the </span>
                <Link href="https://erc20faucet.com/" target="_blank" className="text-blue-500 underline">
                    ERC20 Faucet by peppersec
                </Link>
            </li>
            <li>
                <span>Get USDC on Goerli using the </span>
                <Link href="https://usdcfaucet.com/" target="_blank" className="text-blue-500 underline">
                    USDC Faucet by blockpatron
                </Link>
            </li>
        </ul>
: null  }
       {
       requestData?.payer?.value === address ? 
       <div>
        <h4 className="text-lg font-semibold my-4">Pay a request</h4>
       
        <button
            disabled={!switchNetwork || !requestData || requestData?.currencyInfo.network === chain?.network}
            onClick={() => switchNetwork?.(chains.find(chain => chain.network === requestData?.currencyInfo.network)?.id)}
            className="btn w-full mb-4"
        >
            Switch to Payment Chain: {requestData?.currencyInfo.network}
            {isSwitchNetworkLoading && " (switching)"}
        </button>

        <button type="button" onClick={handleApprove} className="btn w-full mb-4">
            Approve
        </button>
        <div className="text-red-500 mb-4">
            {!switchNetwork && "Programmatic switch network not supported by wallet."}
        </div>
        <div className="text-red-500 mb-4">
            {error && error.message}
        </div>


{/* @ts-ignore */}
    
<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click the button below to close</p>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

{/* confirmation modal */}
<dialog id="confirmation_modal" className="modal">
  <div className="modal-box bg-white">
    <h3 className="font-bold text-lg">Confirmation</h3>
    <p>Please confirm by writing the last 6 digits of the receiver address.</p>
    <input 
      type="text" 
      className="input input-bordered w-full mb-4" 
      maxLength={6} 
      value={confirmationDigits} 
      onChange={(e) => setConfirmationDigits(e.target.value)}
    />
    <div className="modal-action">
      <button className="btn" onClick={handleConfirmation}>Confirm</button>
      {/* @ts-ignore */}
      <button className="btn btn-secondary" onClick={() => document.getElementById('confirmation_modal').close()}>Cancel</button>
    </div>
  </div>
</dialog>


        <button type="button" onClick={handlePay} className="btn btn-primary w-full mb-4">
            Pay now
        </button>

        <h4 className="text-lg font-semibold my-4">Request info</h4>
   
        <p className="mb-2">App status: {status}</p>
        <p className="mb-4">Request state: {requestData?.state}</p>
        {/* <pre className="bg-gray-200 p-4 rounded">{JSON.stringify(requestData, undefined, 2)}</pre> */}
        </div>
          : null}

{
       requestData?.payee?.value === address ? 
       <div>
        <h4 className="text-lg font-semibold my-4">Pay a request</h4>
       
        <button
            disabled={!switchNetwork || !requestData || requestData?.currencyInfo.network === chain?.network}
            onClick={() => switchNetwork?.(chains.find(chain => chain.network === requestData?.currencyInfo.network)?.id)}
            className="btn w-full mb-4"
        >
            Switch to Payment Chain: {requestData?.currencyInfo.network}
            {isSwitchNetworkLoading && " (switching)"}
        </button>

        <button type="button" onClick={handleApprove} className="btn w-full mb-4">
            Approve
        </button>
        <div className="text-red-500 mb-4">
            {!switchNetwork && "Programmatic switch network not supported by wallet."}
        </div>
        <div className="text-red-500 mb-4">
            {error && error.message}
        </div>
        <button type="button" onClick={handleAcceptPayment} className="btn btn-primary w-full mb-4">
            Accept Payment
        </button>

        <h4 className="text-lg font-semibold my-4">Request info</h4>
     
        <p className="mb-2">App status: {status}</p>
        <p className="mb-4">Request state: {requestData?.state}</p>

        </div>
          : null}
    </div>
</div>

  );
}
