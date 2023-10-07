import { NetworkName, RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { EVMGasType, TransactionGasDetails, getEVMGasTypeForTransaction } from "@railgun-community/shared-models";
import { gasEstimateForShield, getShieldPrivateKeySignatureMessage, populateShield } from "@railgun-community/wallet";
import { prepareWriteContract, erc20ABI } from "@wagmi/core";

export const getShieldSignatureMessage: () => string = () => {
  return getShieldPrivateKeySignatureMessage();
};

//   const shieldPrivateKey = keccak256(
//     await wallet.signMessage(shieldSignatureMessage),
//   );

const getGasDetails: (network: any, gasEstimate: bigint) => TransactionGasDetails = (
  network: any,
  gasEstimate: bigint,
) => {
  const evmGasType = getEVMGasTypeForTransaction(network.name, true);

  // Proper calculation of gas Max Fee and gas Max Priority Fee is not covered in this guide. See: https://docs.alchemy.com/docs/how-to-build-a-gas-fee-estimator-using-eip-1559
  const maxFeePerGas = BigInt("0x100000");
  const maxPriorityFeePerGas = BigInt("0x010000");

  const gasPrice = BigInt("0x1234567890"); // TODO change this

  if (evmGasType === EVMGasType.Type0) {
    return {
      evmGasType,
      gasEstimate,
      gasPrice,
    };
  } else if (evmGasType === EVMGasType.Type1) {
    return {
      evmGasType,
      gasEstimate,
      gasPrice,
    };
  } else {
    return {
      evmGasType,
      gasEstimate,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }
};

// tx to send
export const getErc20ShieldingTx = async (shieldPrivateKey: string, network: any, request: any, from: any) => {
  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress: request.currencyInfo.value,
      amount: BigInt(request.expectedAmount),
      // amount: request.hexAmount, // ethers.utils.parseUnits(request.expectedAmount, tokenDecimals).toHexString(), // must be hex request.expectedAmount), // hexadecimal amount
      recipientAddress: request.zkAddress, // RAILGUN address
    },
  ];

  const { gasEstimate } = await gasEstimateForShield(
    getNetworkName(network),
    shieldPrivateKey,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    from,
  );

  const gasDetails = getGasDetails(network, gasEstimate);

  const { transaction } = await populateShield(network.name, shieldPrivateKey, erc20AmountRecipients, [], gasDetails);

  return transaction;
};

export const getConfigForApprove = async (request: any, network: any) => {
  console.log(network, request);
  const config = await prepareWriteContract({
    address: request.currencyInfo.value,
    abi: erc20ABI,
    functionName: "approve",
    args: [getRailgunSmartWalletContract(network), BigInt(request.expectedAmount)],
  });

  return config;
};

const getRailgunSmartWalletContract = (chain: any) => {
  if (chain.network === "goerli") {
    return "0x14a57CA7C5c1AD54fB6c642f428d973fcD696ED4";
  } else if (chain.network === "polygon") {
    return "0x19B620929f97b7b990801496c3b361CA5dEf8C71";
  }
};

const getNetworkName = (chain: any) => {
  if (chain.network === "goerli") {
    return NetworkName.EthereumGoerli;
  } else if (chain.network === "polygon") {
    return NetworkName.Polygon;
  }
};

// const getRailgunNetwork = (chain: any) => {
//   if (chain.network === "goerli") {
//     return {
//       blockExplorerUrl: "https://goerli.etherscan.io/",
//       railgunNetworkName: NetworkName.EthereumGoerli,
//       chainId: 5,
//       // wethAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
//       evmGasType: EVMGasType.Type2,
//       baseToken: {
//         symbol: 'ETH',
//         name: 'ETH',
//         logoURI: '',
//       },
//       fallbackProviders: {
//         chainId: 5,
//         providers: [{ provider: "https://goerli.infura.io/v3/", priority: 1, weight: 1 }],
//       },
//     };
//   } else if (chain.network === "polygon") {
//     return {
//       blockExplorerUrl: 'https://polygonscan.com/',
//       railgunNetworkName: NetworkName.Polygon,
//       chainId: 5,
//       wethAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
//       evmGasType: EVMGasType.Type2,
//       baseToken: {
//         symbol: 'MATIC',
//         name: 'MATIC',
//         logoURI: '',
//       },
//       fallbackProviders: {
//         chainId: 5,
//         providers: [{ provider: "https://goerli.infura.io/v3/", priority: 1, weight: 1 }],
//       },
//     };
//   }
// };
