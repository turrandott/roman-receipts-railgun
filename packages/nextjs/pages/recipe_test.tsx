import { RecipeInput } from "@railgun-community/cookbook";
import { NetworkName } from "@railgun-community/shared-models";
import { getRailgunSmartWalletContractForNetwork } from "@railgun-community/wallet";
import { signMessage } from "@wagmi/core";
import { prepareWriteContract, sendTransaction, writeContract } from "@wagmi/core";
import { keccak256 } from "ethers";
import { useAccount, useNetwork } from "wagmi";
import { BasicERC20ApproveRecipe } from "~~/utils/railgun/recipes/BasicERC20ApproveRecipe";
import {
  getApproveContractConfig,
  getErc20ShieldingTx,
  getShieldSignatureMessage,
} from "~~/utils/railgun/token-shielder";
import launchWallet from "~~/utils/railgun/wallet-engine/engine_loader";

// CODE START

export default function Home() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  async function ApproveERC20ThroughRecipe() {
    // start engine
    await launchWallet();

    // useful env infos
    const networkName: NetworkName = NetworkName.EthereumGoerli;
    const railgunAddress: string = getRailgunSmartWalletContractForNetwork(networkName).address as `0x{string}`;
    const goerliUSDTaddress = "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49";

    // Creating the recipe
    const recipe = new BasicERC20ApproveRecipe("0xdAB8E0476C2Bfb5aA99579CF2f7d13b60295eaFa"); // Need to add the Request contract

    // Creating the recipe input
    const recipeInput: RecipeInput = {
      networkName: networkName,
      railgunAddress: railgunAddress,
      erc20Amounts: [
        {
          tokenAddress: goerliUSDTaddress,
          decimals: 6n,
          isBaseToken: false,
          amount: 10000n,
        },
      ],
      nfts: [],
    };

    // Calling the recipe function
    const recipeOutput = recipe.getRecipeOutput(recipeInput);
    console.log(recipeOutput);

    /*
    // ERC20 approve for railgunSmartWalletContract
    const { request } = await prepareWriteContract(getApproveContractConfig(RNrequest, chain));
    const { hash: approveHash } = await writeContract(request);
    console.log("hash approve", approveHash);

    // start shielding
    const shieldSignatureMessage: string = getShieldSignatureMessage();
    const signature = await signMessage({
      message: shieldSignatureMessage,
    });
    const shieldPrivateKey = keccak256(signature).toString();

    // get tx for shielding
    const shieldingTX = await getErc20ShieldingTx(shieldPrivateKey, chain, RNrequest, address);
    console.log("tx", shieldingTX);

    // const configShieldTx = await prepareSendTransaction(shieldingTX);

    // send tx with our wallet (via Wagmi in this case)
    const { hash: shieldHash } = await sendTransaction(shieldingTX);
    console.log("hash shield", shieldHash);
    */
  }

  function handlePay(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    ApproveERC20ThroughRecipe();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button className="btn-primary mr-4 py-2 px-4 border rounded" onClick={handlePay}>
        Approve USDT through a recipe
      </button>
    </div>
  );
}

const RNrequest = {
  _events: {},
  _eventsCount: 0,
  currency: "FAU-goerli",
  expectedAmount: "1000000000000000000",
  payee: {
    type: "ethereumAddress",
    value: "0x898c6F7bD2cDaEfcA404699825efFc841d7eA299",
  },
  timestamp: 1696671504,
  payer: {
    type: "ethereumAddress",
    value: "0x898c6F7bD2cDaEfcA404699825efFc841d7eA299",
  },
  extensionsData: [
    {
      action: "create",
      id: "pn-erc20-fee-proxy-contract",
      parameters: {
        feeAddress: "0x0000000000000000000000000000000000000000",
        feeAmount: "0",
        paymentAddress: "0x2554657b368346a42725Ceb86466dc09884F84EC",
        paymentNetworkName: "goerli",
        salt: "8426e8b31da71b67",
      },
      version: "0.2.0",
    },
    {
      action: "create",
      id: "content-data",
      parameters: {
        content: {
          reason: "newpayment",
          dueDate: "2027-02-22",
        },
      },
      version: "0.1.0",
    },
  ],
  extensions: {
    "pn-erc20-fee-proxy-contract": {
      events: [
        {
          name: "create",
          parameters: {
            feeAddress: "0x0000000000000000000000000000000000000000",
            feeAmount: "0",
            paymentAddress: "0x2554657b368346a42725Ceb86466dc09884F84EC",
            salt: "8426e8b31da71b67",
          },
          timestamp: 1696671516,
        },
      ],
      id: "pn-erc20-fee-proxy-contract",
      type: "payment-network",
      values: {
        salt: "8426e8b31da71b67",
        receivedPaymentAmount: "0",
        receivedRefundAmount: "0",
        sentPaymentAmount: "0",
        sentRefundAmount: "0",
        paymentAddress: "0x2554657b368346a42725Ceb86466dc09884F84EC",
        feeAddress: "0x0000000000000000000000000000000000000000",
        feeAmount: "0",
        feeBalance: {
          events: [],
          balance: "0",
        },
      },
      version: "0.2.0",
    },
    "content-data": {
      events: [],
      id: "content-data",
      type: "content-data",
      values: {
        content: {
          reason: "newpayment",
          dueDate: "2027-02-22",
        },
      },
      version: "0.1.0",
    },
  },
  requestId: "0147bf91c2ea153f9466897aa79357036ea764e4fad76d0fc4ddd9df4d815eb500",
  version: "2.0.3",
  events: [
    {
      actionSigner: {
        type: "ethereumAddress",
        value: "0x898c6f7bd2cdaefca404699825effc841d7ea299",
      },
      name: "create",
      parameters: {
        expectedAmount: "1000000000000000000",
        extensionsDataLength: 2,
        isSignedRequest: false,
      },
      timestamp: 1696671516,
    },
  ],
  state: "created",
  creator: {
    type: "ethereumAddress",
    value: "0x898c6F7bD2cDaEfcA404699825efFc841d7eA299",
  },
  balance: {
    balance: "0",
    events: [],
    escrowEvents: [],
  },
  contentData: {
    reason: "newpayment",
    dueDate: "2027-02-22",
  },
  currencyInfo: {
    type: "ERC20",
    value: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
    network: "goerli",
  },
  meta: {
    ignoredTransactions: [],
    transactionManagerMeta: {
      dataAccessMeta: {
        transactionsStorageLocation: ["QmRjZLasc66RpNmbkkK3hR1RocFzKGXtj8hRx738EBgV7V"],
        storageMeta: [
          {
            ethereum: {
              blockConfirmation: 0,
              blockNumber: 9824316,
              blockTimestamp: 1696671516,
              networkName: "goerli",
              smartContractAddress: "0x132d0c7309ca3286a644668469d3b09dfb81f757",
              transactionHash: "0x7557bfff2d9a02f1ffefd1083e9a2e1a524e50ab0a4e85de84bae1ff69dd69f0",
            },
            ipfs: {
              size: 1575,
            },
            state: "confirmed",
            storageType: "ethereumIpfs",
            timestamp: 1696671516,
          },
        ],
      },
      ignoredTransactions: [null],
    },
  },
  pending: null,
};
