// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const erc721_address = "0x06B8CA53d6983Eb7cd4BBf13Ef7DE9cdCCc3fB37";
const erc20_address = "0xD0bd37Ba29ADC62B4871A761CB1664D3a6d1b386";

async function deployContract(contract_name){
    const Contract = await hre.ethers.getContractFactory(contract_name);
    const contract = await Contract.deploy();
    await contract.deployed();

    console.log("contract " + contract_name + " deployed to :" + contract.address);
    return contract;
}

async function deployNFTMarket(){
    const Contract = await hre.ethers.getContractFactory("NFTMarket");
    const contract = await Contract.deploy(erc20_address,erc721_address);
    await contract.deployed();

    console.log("contract NFTMarket" + " deployed to :" + contract.address);
    return contract;
}

async function main() {
    // await deployContract("Etherloop");
    await deployContract("Etherloop_2612");
    await deployContract("Vault");
    // await deployContract("Etherloop_721");
    // await deployNFTMarket();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// https://testnet.bscscan.com/address/0x7Ab0f1aE80648732bC77b38F070d0799828C2a3D
// https://testnet.bscscan.com/address/0x37B240348E474C199BB531597004c624f77a56D5