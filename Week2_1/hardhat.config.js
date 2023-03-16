require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

let dotenv = require('dotenv');
dotenv.config({path:"./.env"})

const PRIVATEKEY_1 = process.env.PRIVATEKEY_1;
const PRIVATEKEY_2 = process.env.PRIVATEKEY_2;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;

module.exports = {

  solidity: "0.8.0",
  networks: {
    localhost:{
      url:"HTTP://127.0.0.1:7545",
      chainId:1337
    },
    
    Goerli:{
      url: GOERLI_RPC_URL,
      chainId: 5,
      accounts: [PRIVATEKEY_1,PRIVATEKEY_2]
    }

  },
  
  etherscan:{
    apiKey: ETHERSCAN_API_KEY,
  },

};
