// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployContract(contract_name){
  const Contract = await hre.ethers.getContractFactory(contract_name);
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log("contract " + contract_name + " deployed to :" + contract.address);
  return contract;
}

async function main() {
  // await deployContract("Etherloop");//0xEbe8a4970931e091F310f0140b105B70dD761740
  // await deployContract("Vault");//0xA32cbEA260814e15834451932B8E9f36da48Ad8d
  await deployContract("AutoCollectUpKeep");//0x850b1fA646aC2e25de62d0F627337c83d8a889Ce
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
