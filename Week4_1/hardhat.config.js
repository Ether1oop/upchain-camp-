require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-abi-exporter');


let dotenv = require('dotenv');
dotenv.config({path:"./.env"})

const PRIVATEKEY_1 = process.env.PRIVATEKEY_1;
const PRIVATEKEY_2 = process.env.PRIVATEKEY_2;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const BSCTEST_API_KEY = process.env.BSCTEST_API_KEY;

module.exports = {

  solidity: "0.8.18",
  networks: {
    dev:{
      url:"http://127.0.0.1:8545/",
      chainId:31337
    },
    
    Goerli:{
      url: GOERLI_RPC_URL,
      chainId: 5,
      accounts: [PRIVATEKEY_1,PRIVATEKEY_2]
    },

    BSCTest:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId:97,
      accounts:[PRIVATEKEY_1,PRIVATEKEY_2]
    }

  },
  
  etherscan:{
    apiKey: ETHERSCAN_API_KEY,
    // apiKey: BSCTEST_API_KEY,
  },

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: ["Vault","Etherloop_2612"],
    spacing: 2,
    pretty: true,
},

};
