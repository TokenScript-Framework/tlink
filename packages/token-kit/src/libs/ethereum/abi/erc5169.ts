export const erc5169ABI = [
  {
    type: "function",
    name: "scriptURI",
    inputs: [],
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
  },
  {
    inputs: [
      {
        name: "newScriptURI",
        type: "string[]",
      },
    ],
    name: "setScriptURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
