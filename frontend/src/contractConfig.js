export const CONTRACT_ADDRESS = "0x1cD544308FCDCC9510bdCC7A680ED10fD947E08b"; 
export const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_priceFeed",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "question",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "targetPrice",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "MarketCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "outcome",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "resolvedPrice",
          "type": "int256"
        }
      ],
      "name": "MarketResolved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        }
      ],
      "name": "betNo",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        }
      ],
      "name": "betYes",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_question",
          "type": "string"
        },
        {
          "internalType": "int256",
          "name": "_targetPrice",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "_durationInSeconds",
          "type": "uint256"
        }
      ],
      "name": "createMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEthUsd",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        }
      ],
      "name": "getPools",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "yes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "no",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "marketCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "markets",
      "outputs": [
        {
          "internalType": "string",
          "name": "question",
          "type": "string"
        },
        {
          "internalType": "int256",
          "name": "targetPrice",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "yesPool",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "noPool",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "resolved",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "outcome",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "priceFeed",
      "outputs": [
        {
          "internalType": "contract AggregatorV3Interface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        }
      ],
      "name": "resolveMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]