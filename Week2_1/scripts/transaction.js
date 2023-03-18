
const { ethers, network, artifacts } = require("hardhat");


async function deposit() {
  let bank = await ethers.getContractAt("Bank","0x2E5A0469caC7C10a0c2C5dE8A79b424a96cF7cfF");

  let tx = await bank.deposit({
    value: ethers.utils.parseEther("0.1")
  });
  await tx.wait();
}


async function withdrawAll(){
  let  bank = await ethers.getContractAt("Bank","0x2E5A0469caC7C10a0c2C5dE8A79b424a96cF7cfF");
  let tx = await bank.withdrawAll();
  await tx.wait();
}


deposit();
withdrawAll();


