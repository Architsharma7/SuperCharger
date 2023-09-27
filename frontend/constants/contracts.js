export const RAAS_HANDLER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "errorCode",
        type: "int256",
      },
    ],
    name: "ActorError",
    type: "error",
  },
  {
    inputs: [],
    name: "FailToCallActor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "InvalidCodec",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidResponseLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "NotEnoughBalance",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "dealId",
        type: "uint64",
      },
    ],
    name: "CompleteAggregatorRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "cid",
        type: "bytes",
      },
    ],
    name: "SubmitAggregatorRequest",
    type: "event",
  },
  {
    inputs: [],
    name: "RENEW_JOB_AMOUNT",
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
  {
    inputs: [],
    name: "REPAIR_JOB_AMOUNT",
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
  {
    inputs: [],
    name: "REPLICATION_JOB_AMOUNT",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_dealId",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_minerId",
        type: "uint64",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofSubtree",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofIndex",
            type: "tuple",
          },
        ],
        internalType: "struct InclusionProof",
        name: "_proof",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "commPc",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePc",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionVerifierData",
        name: "_verifierData",
        type: "tuple",
      },
    ],
    name: "complete",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "commPa",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePa",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionAuxData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "commDs",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "offset",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "size",
            type: "uint64",
          },
          {
            internalType: "bytes16",
            name: "checksum",
            type: "bytes16",
          },
        ],
        internalType: "struct SegmentDesc",
        name: "_sd",
        type: "tuple",
      },
    ],
    name: "computeChecksum",
    outputs: [
      {
        internalType: "bytes16",
        name: "",
        type: "bytes16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofSubtree",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofIndex",
            type: "tuple",
          },
        ],
        internalType: "struct InclusionProof",
        name: "ip",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "commPc",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePc",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionVerifierData",
        name: "verifierData",
        type: "tuple",
      },
    ],
    name: "computeExpectedAuxData",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "commPa",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePa",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionAuxData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "dealId",
        type: "uint64",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofSubtree",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint64",
                name: "index",
                type: "uint64",
              },
              {
                internalType: "bytes32[]",
                name: "path",
                type: "bytes32[]",
              },
            ],
            internalType: "struct ProofData",
            name: "proofIndex",
            type: "tuple",
          },
        ],
        internalType: "struct InclusionProof",
        name: "ip",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "commPc",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePc",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionVerifierData",
        name: "verifierData",
        type: "tuple",
      },
    ],
    name: "computeExpectedAuxDataWithDeal",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "commPa",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "sizePa",
            type: "uint64",
          },
        ],
        internalType: "struct InclusionAuxData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "left",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "right",
        type: "bytes32",
      },
    ],
    name: "computeNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bytes32[]",
            name: "path",
            type: "bytes32[]",
          },
        ],
        internalType: "struct ProofData",
        name: "d",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "subtree",
        type: "bytes32",
      },
    ],
    name: "computeRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_worker",
        type: "address",
      },
    ],
    name: "disableWorker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "getActiveDeals",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "dealId",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "minerId",
            type: "uint64",
          },
        ],
        internalType: "struct IAggregatorOracle.Deal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCIDs",
    outputs: [
      {
        internalType: "bytes[]",
        name: "",
        type: "bytes[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "getAllDeals",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "dealId",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "minerId",
            type: "uint64",
          },
        ],
        internalType: "struct IAggregatorOracle.Deal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "epochs",
        type: "uint64",
      },
    ],
    name: "getExpiringDeals",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "dealId",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "minerId",
            type: "uint64",
          },
        ],
        internalType: "struct IAggregatorOracle.Deal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "getRaasData",
    outputs: [
      {
        components: [
          {
            internalType: "enum RassJobHandler.RaasJobStatus",
            name: "jobStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "totalRepairJobsDone",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRenewJobsDone",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalReplicationJobsDone",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalAmountSpent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalAmountDeposited",
            type: "uint256",
          },
        ],
        internalType: "struct RassJobHandler.RassJobData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "left",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "right",
        type: "bytes32",
      },
    ],
    name: "hashNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "commDs",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "offset",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "size",
            type: "uint64",
          },
          {
            internalType: "bytes16",
            name: "checksum",
            type: "bytes16",
          },
        ],
        internalType: "struct SegmentDesc",
        name: "sd",
        type: "tuple",
      },
    ],
    name: "serialize",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "submit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "submitRenewRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "submitRepairRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_cid",
        type: "bytes",
      },
    ],
    name: "submitReplicationRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "truncatedHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bytes32[]",
            name: "path",
            type: "bytes32[]",
          },
        ],
        internalType: "struct ProofData",
        name: "proof",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "leaf",
        type: "bytes32",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_worker",
        type: "address",
      },
    ],
    name: "whitelistWorker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const RAAS_HANDLER_ADDRESS =
  "0x812d210891726613C0b29e645D56C2ad80c635FF";
