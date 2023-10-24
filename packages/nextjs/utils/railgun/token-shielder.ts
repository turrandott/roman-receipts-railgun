import { NetworkName, RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { EVMGasType, TransactionGasDetails, getEVMGasTypeForTransaction } from "@railgun-community/shared-models";
import {
  gasEstimateForShield,
  getRailgunSmartWalletContractForNetwork,
  getShieldPrivateKeySignatureMessage,
  populateShield,
} from "@railgun-community/wallet";
import { erc20ABI } from "@wagmi/core";

// hardcoded variables!

export const getApproveContractConfig = (request: any, chain: any) => {
  const network = getNetworkName(chain);
  const railgunSmartWalletContract = getRailgunSmartWalletContractForNetwork(network).address as `0x{string}`;
  // console.log("raulgunSmartWalletContract", raulgunSmartWalletContract);
  const contractConfig = {
    address: "0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd", // DAI test // request.currencyInfo.value,
    abi: erc20ABI,
    functionName: "approve",
    args: [railgunSmartWalletContract, BigInt("10")],
  };

  return contractConfig;
};

export const getShieldSignatureMessage: () => string = () => {
  return getShieldPrivateKeySignatureMessage();
};

// tx to send
export const getErc20ShieldingTx = async (shieldPrivateKey: string, network: any, request: any, from: any) => {
  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress: "0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd", // request.currencyInfo.value,
      // amount: BigInt(request.expectedAmount),
      amount: BigInt("10"),
      // amount: request.hexAmount, // ethers.utils.parseUnits(request.expectedAmount, tokenDecimals).toHexString(), // must be hex request.expectedAmount), // hexadecimal amount
      // recipientAddress: request.zkAddress, // RAILGUN address
      recipientAddress:
        "0zk1qypm86dh0862j9h7z2d5wltdxwrd2pqfg48wrle9rdnzyfzdc9u9lrv7j6fe3z53luqmhmf4muuupxvedcwfmxw034wqqq48uq623s450mx5ajxlz0wkgfugpn5",
    },
  ];

  const { gasEstimate } = await gasEstimateForShield(
    getNetworkName(network),
    shieldPrivateKey,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    from,
  );

  console.log(gasEstimate);

  const gasDetails = getGasDetails(network, gasEstimate);

  const { transaction } = await populateShield(
    getNetworkName(network),
    shieldPrivateKey,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    gasDetails,
  );

  return transaction;
};

const getGasDetails: (network: any, gasEstimate: bigint) => TransactionGasDetails = (
  network: any,
  gasEstimate: bigint,
) => {
  const evmGasType = getEVMGasTypeForTransaction(getNetworkName(network), true);

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

const getNetworkName = (chain: any) => {
  // return NetworkName.Ethereum;
  if (chain.network === "goerli") {
    return NetworkName.EthereumGoerli;
  } else if (chain.network === "polygon") {
    return NetworkName.Polygon;
  }
};
