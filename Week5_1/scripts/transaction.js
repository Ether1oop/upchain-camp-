const hre = require("hardhat");

const etherloop_address = "0xEbe8a4970931e091F310f0140b105B70dD761740";
const vault_address = "0xA32cbEA260814e15834451932B8E9f36da48Ad8d";

async function main() {
    const [owner] = await ethers.getSigners();
    const etherloop = await ethers.getContractAt("Etherloop",etherloop_address);
    const vault = await ethers.getContractAt("contracts/Vault.sol:Vault",vault_address);

    await etherloop.transfer(vault.address, 10000);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });