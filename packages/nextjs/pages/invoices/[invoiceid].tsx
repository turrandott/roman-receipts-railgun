"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { storageChains } from "../../config/storage-chain";
import USDTabi from "../../generated/USDTabi.json";
import azuroAbi from "../../generated/azuroDoubleAbi.json";
import testabi from "../../generated/testabi.json";
import { useEthersV5Provider } from "../../hooks/ethers/use-ethers-v5-provider";
import { useEthersV5Signer } from "../../hooks/ethers/use-ethers-v5-signer";
import Url from "./url";
import "@rainbow-me/rainbowkit/styles.css";
import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
import { approveErc20, hasErc20Approval, hasSufficientFunds, payRequest } from "@requestnetwork/payment-processor";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";

const calculateStatus = (state: string, expectedAmount: bigint, balance: bigint) => {
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
  DEGENERACY_APPROVED = "degeneracy approved",
  BET_PLACED = "bet placed",
  BET_WON = "double won",
  BET_LOST = "double lost",
  PAYOUT_WITHDRAWN = "payout withdrawn",
  ERROR_OCCURRED = "error occurred",
}

export default function Home() {
  const [storageChain, setStorageChain] = useState("100");
  const [approved, setApproved] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [confirmationDigits, setConfirmationDigits] = useState("");
  const router = useRouter();
  const { invoiceid } = router.query;
  const [status, setStatus] = useState(APP_STATUS.AWAITING_INPUT);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading: isSwitchNetworkLoading, switchNetwork } = useSwitchNetwork();
  const [requestData, setRequestData] = useState<Types.IRequestDataWithEvents>();
  const provider = useEthersV5Provider();
  const signer = useEthersV5Signer();

  let payout: number;
  console.log(router);

  const { write: bet } = useContractWrite({
    address: "0x40FE3b7d707D8243E7800Db704A55d7AAbe3B2d4",
    abi: azuroAbi,
    functionName: "bet",
  });

  const { data: gameResults } = useContractRead({
    address: "0x40FE3b7d707D8243E7800Db704A55d7AAbe3B2d4",
    abi: azuroAbi,
    functionName: "games",
  });

  const { write: approveUSDT } = useContractWrite({
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    abi: USDTabi,
    functionName: "approve",
  });

  const { write: withdrawAmountWon } = useContractWrite({
    address: "0x40FE3b7d707D8243E7800Db704A55d7AAbe3B2d4",
    abi: azuroAbi,
    functionName: "betPayout",
  });

  useContractEvent({
    address: "0x40FE3b7d707D8243E7800Db704A55d7AAbe3B2d4",
    abi: azuroAbi,
    eventName: "GameResultFulfilled",
    listener(log) {
      payout = parseInt(log[0]["args"]["_payout"], 10);
      setFetching(false);
      if (payout > 0) {
        setStatus(APP_STATUS.BET_WON);
      } else {
        setStatus(APP_STATUS.BET_LOST);
      }
    },
  });

  useEffect(() => {
    console.log(invoiceid);
  });

  useEffect(() => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://xdai.gateway.request.network/",
      },
    });
    requestClient.fromRequestId(invoiceid as string).then(request => {
      setRequestData(request.getData());
      console.log(request.getData());
    });
  }, [address, invoiceid]);

  const getBaseUrl = () => {
    return "https://xdai.gateway.request.network/";

    // const url = storageChains.get(storageChain)?.gateway;
    // console.log("url", url);
    // return url;
    // if (chain.id === 137) return "https://polygon.gateway.request.network/";
    // if (chain.id === 5) return "https://goerli.gateway.request.network/";
    // console.log("getBaseUrl");
    // console.log(chain);

    // //"https://goerli.gateway.request.network/"

    // return "https://xdai.gateway.request.network/";
  };

  // FUNCTIONS
  async function payTheRequest() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: getBaseUrl(),
        // baseURL: storageChains.get(storageChain)?.gateway,
      },
    });

    console.log({ requestClient });

    try {
      const _request = await requestClient.fromRequestId(requestData?.requestId);
      let _requestData = _request.getData();
      console.log({ _requestData });
      const paymentTx = await payRequest(_requestData, signer);
      await paymentTx.wait(2);

      // Poll the request balance once every second until payment is detected
      // TODO Add a timeout
      while (_requestData.balance?.balance < _requestData.expectedAmount) {
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
      console.log(err);
    }
  }

  async function approveBet() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)?.gateway,
      },
    });

    const _request = await requestClient.fromRequestId(requestData?.requestId);
    const _requestData = _request.getData();

    try {
      const amount = _requestData.expectedAmount;
      //@ts-ignore
      approveUSDT({ args: ["0x40FE3b7d707D8243E7800Db704A55d7AAbe3B2d4", amount.slice(0, -1)] });
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }
    setTimeout(() => {
      setApproved(true);
      setStatus(APP_STATUS.DEGENERACY_APPROVED);
    }, 10000);
  }

  async function doubleYourIncome() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)?.gateway,
      },
    });

    const _request = await requestClient.fromRequestId(requestData?.requestId);
    const _requestData = _request.getData();

    try {
      const amount = _requestData.expectedAmount;
      //@ts-ignore
      bet({ args: [amount.slice(0, -12)] });
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }

    setFetching(true);
    setStatus(APP_STATUS.BET_PLACED);
  }

  // // NOT USED DUE TO RAILGUN ISSUES
  // async function acceptPayment() {
  //   const signatureProvider = new Web3SignatureProvider(walletClient);
  //   const requestClient = new RequestNetwork({
  //     nodeConnectionConfig: {
  //       baseURL: storageChains.get(storageChain)!.gateway,
  //     },
  //     signatureProvider: signatureProvider,
  //   });

  //   try {
  //     const _request = await requestClient.fromRequestId(requestData!.requestId);
  //     let _requestData = _request.getData();

  //     const ETHEREUM_ADDRESS = "ethereumAddress";
  //     const ETHEREUM_SMART_CONTRACT = "ethereumSmartContract";

  //     const identity = {
  //       type: ETHEREUM_ADDRESS,
  //       value: requestData?.payee?.value,
  //     };
  //     //@ts-ignore
  //     const declareReceivedTx = await _request.declareReceivedPayment(
  //       _requestData.expectedAmount,
  //       "thank you",
  //       requestData?.payee,
  //     );
  //     console.log(declareReceivedTx);
  //     while (_requestData.state != Types.RequestLogic.STATE.ACCEPTED) {
  //       _requestData = await _request.refresh();
  //       alert(`state = ${_requestData.state}`);
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //     }
  //     alert(`payment accepted!`);
  //     setRequestData(_requestData);
  //     setStatus(APP_STATUS.PAYMENT_ACCEPTED);
  //   } catch (err) {
  //     setStatus(APP_STATUS.ERROR_OCCURRED);
  //     console.log(err);
  //     alert(err);
  //   }
  // }

  function handlePay(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setStatus(APP_STATUS.PAYING);
    payTheRequest();
  }

  function handleApproveBet(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    approveBet();
  }

  function handleDoubleYourIncome(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    doubleYourIncome();
  }

  async function approve() {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)?.gateway,
      },
    });

    try {
      const _request = await requestClient.fromRequestId(requestData?.requestId);
      const _requestData = _request.getData();

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
    if (confirmationDigits === requestData.payee?.value.slice(-6)) {
      // Check if the last 6 digits match
      //@ts-ignore
      document.getElementById("confirmation_modal").close(); // Close the modal
      setStatus(APP_STATUS.PAYING);
      payTheRequest(); // Continue with the payment process
    } else {
      // Handle the error, for example, by showing an alert or updating the state to show an error message
      alert("The digits entered do not match. Please try again.");
    }
  }

  // this part is needed to handle the withdrawal
  function withdrawPayout() {
    try {
      withdrawAmountWon();
      setStatus(APP_STATUS.PAYOUT_WITHDRAWN);
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
  }

  function handleWidthdrawPayout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    withdrawPayout();
  }



  function degeneracyButtonTextManager(): string {
    if (status === APP_STATUS.PAYOUT_WITHDRAWN){
      return "BUY YOURSELF A GELATO";
    }
    else if (status === APP_STATUS.BET_LOST) {
      return "SAY GOODBYE TO YOUR WIFE...";
    } else if (status === APP_STATUS.BET_WON) {
      return "YOUR CHILDREN WON'T STARVE THIS TIME!";
    } else if (status === APP_STATUS.BET_PLACED) {
      return "CALCULATING... PLEASE WAIT";
    } else if (status === APP_STATUS.DEGENERACY_APPROVED) {
      return "DOUBLE OR NOTHING";
    } else if (!approved) {
      return "APPROVE DEGENERACY";
    }
  }

  function disableDegenButton(): boolean {
    if (status === APP_STATUS.BET_PLACED || status === APP_STATUS.BET_LOST) {
      return true;
    } else {
      return false;
    }
  }

  function degeneracyButtonManager(e: any): any {
    if (!approved) {
      return handleApproveBet(e);
    } else if (!fetching && status === APP_STATUS.DEGENERACY_APPROVED) {
      return handleDoubleYourIncome(e);
    } else {
      return null;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-4/5 md:w-1/2 mt-12">
        <h3 className="text-center text-xl font-bold mb-4">Invoice</h3>
        <p className="text-xs break-all">id: {invoiceid}</p>
        <div className="flex justify-between mb-2">
          <span className="font-medium">From:</span>

          <span className="hidden lg:block">{requestData?.payer?.value}</span>
          <span className="block lg:hidden">
            {requestData?.payer?.value.slice(0, 5) + "..." + requestData?.payer?.value.slice(35, 41)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="font-medium">To:</span>
          <span className="hidden lg:block">{requestData?.payee?.value}</span>
          <span className="block lg:hidden">
            {requestData?.payee?.value.slice(0, 5) + "..." + requestData?.payee?.value.slice(35, 41)}
          </span>{" "}
          {/* Assuming this is correct, but you may want to adjust this if "To" and "From" values are different */}
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Amount:</span>
          <span>
            {requestData?.expectedAmount ? formatUnits(BigInt(requestData?.expectedAmount as any), 18) : null}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Reason:</span>
          <span>{requestData?.contentData.reason}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span>
            {requestData &&
              calculateStatus(
                requestData?.state as any,
                BigInt(requestData?.expectedAmount as any),
                BigInt(requestData?.balance?.balance || 0),
              )}
          </span>
        </div>

        {requestData?.payer?.value === address ? (
          <ul className="list-disc pl-5 mb-4 my-12">
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
        ) : null}

        {requestData?.payer?.value === address ? (
          <div className="my-16">
            <h4 className="text-lg font-semibold my-4">Pay a request</h4>

            <button
              disabled={!switchNetwork || !requestData || requestData?.currencyInfo.network === chain?.network}
              onClick={() =>
                switchNetwork?.(chains.find(chain => chain.network === requestData?.currencyInfo.network)?.id)
              }
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
            <div className="text-red-500 mb-4">{error && error.message}</div>

            {/* @ts-ignore */}

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
                  onChange={e => setConfirmationDigits(e.target.value)}
                />
                <div className="modal-action">
                  <button className="btn btn-primary" onClick={handleConfirmation}>
                    Confirm
                  </button>

                  <button
                    className="btn bg-white"
                    onClick={() => document.getElementById("confirmation_modal").close()}
                  >
                    Cancel
                  </button>
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
        ) : null}

        {requestData?.payee?.value === address ? (
          <div className="my-16">
            <h4 className="text-lg font-semibold my-4 text-center">Manage a request</h4>

            <button
              disabled={!switchNetwork || !requestData || requestData?.currencyInfo.network === chain?.network}
              onClick={() =>
                switchNetwork?.(chains.find(chain => chain.network === requestData?.currencyInfo.network)?.id)
              }
              className="btn w-full mb-4"
            >
              Switch to Payment Chain: {requestData?.currencyInfo.network}
              {isSwitchNetworkLoading && " (switching)"}
            </button>

            <div className="text-red-500 mb-4">
              {!switchNetwork && "Programmatic switch network not supported by wallet."}
            </div>

            <div className="text-red-500 mb-4">{error && error.message}</div>

            <button
              type="button"
              onClick={e => degeneracyButtonManager(e)}
              className={approved ? "btn btn-primary w-full mb-4" : "btn w-full mb-4"}
              disabled={disableDegenButton()}
            >
              {degeneracyButtonTextManager()}
            </button>

            <div className="my-16">
              <h4 className="text-lg font-semibold my-4 text-center">Request info</h4>
              <p className="mb-1">App status: {status}</p>
              <p className="mb-2">Request state: {requestData?.state}</p>
            </div>
            <Url />
          </div>
        ) : null}
      </div>
    </div>
  );
}
