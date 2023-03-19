
const { ethers, network, artifacts } = require("hardhat");

const score_address = "0xe7C220F57156177e8Ad86d604D8dC2D0Ef3E2ba0";
const teacher_address = "0x2E5A0469caC7C10a0c2C5dE8A79b424a96cF7cfF";

async function main(){
  let score = await ethers.getContractAt("Score",score_address);
  let tx = await score.setTeacher(teacher_address);
  await tx.wait();
  console.log(tx.hash);


  let teacher = await ethers.getContractAt("Teacher",teacher_address);
  tx = await teacher.callSetScore(teacher_address, 99);
  await tx.wait();
  console.log(tx.hash);
}

main()

