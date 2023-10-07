import { NetworkName, RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { EVMGasType, TransactionGasDetails, getEVMGasTypeForTransaction } from "@railgun-community/shared-models";
import { gasEstimateForShield, populateShield } from "@railgun-community/wallet";

const shieldSignatureMessage = getShieldPrivateKeySignatureMessage();

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
export const getTx = async (shieldPrivateKey: string, network: any, request: any, from: any) => {
  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress: request.currencyInfo.value,
      amount: request.hexAmount, // ethers.utils.parseUnits(request.expectedAmount, tokenDecimals).toHexString(), // must be hex request.expectedAmount), // hexadecimal amount
      recipientAddress: request.zkAddress, // RAILGUN address
    },
  ];

  const { gasEstimate } = await gasEstimateForShield(
    network.name,
    shieldPrivateKey,
    erc20AmountRecipients,
    [], // nftAmountRecipients
    from,
  );

  const gasDetails = getGasDetails(network, gasEstimate);

  const { transaction } = await populateShield(network.name, shieldPrivateKey, erc20AmountRecipients, [], gasDetails);

  return transaction;
};
