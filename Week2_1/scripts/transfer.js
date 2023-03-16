// 引入ether.js库
const { ethers } = require("ethers");
let dotenv = require('dotenv');
dotenv.config({path:"./.env"})

const PRIVATEKEY_1 = process.env.PRIVATEKEY_1;
const PRIVATEKEY_2 = process.env.PRIVATEKEY_2;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;

// 定义智能合约地址和ABI
const contractAddress = "0x134FD1B3Fcb8d3E6f689445200185CC625Ee1505";
const contractABI = [
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
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
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawAll",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// 使用私钥创建 signer
const privateKey = PRIVATEKEY_1;
const provider = new ethers.providers.EtherscanProvider('goerli', ETHERSCAN_API_KEY); // 替换为您的 Infura 项目 ID
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);


async function deposit() {
    const tx = await contract.deposit({
        value : ethers.utils.parseEther("0.01")
    });
    console.log(`Deposit transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Deposit transaction confirmed in block ${receipt.blockNumber}`);
}

deposit();
