const contracts = {
  5: [
    {
      chainId: "5",
      name: "goerli",
      contracts: {
        AcceptPayments: {
          address: "0x853e0A7A0906102099eB24c5018c6A68B4C45c5b",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "_requestId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "_player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint128",
                  name: "_amount",
                  type: "uint128",
                },
                {
                  indexed: false,
                  internalType: "uint128",
                  name: "_payout",
                  type: "uint128",
                },
              ],
              name: "GameResultFulfilled",
              type: "event",
            },
            {
              inputs: [],
              name: "amount",
              outputs: [
                {
                  internalType: "uint128",
                  name: "",
                  type: "uint128",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "emitEvent",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "payout",
              outputs: [
                {
                  internalType: "uint128",
                  name: "",
                  type: "uint128",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "player",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "requestId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
