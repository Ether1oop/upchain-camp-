const hre = require("hardhat");

const erc2612_address = "0xEbe8a4970931e091F310f0140b105B70dD761740";
const vault_address = "0xA32cbEA260814e15834451932B8E9f36da48Ad8d";

async function permitOffline(erc2612,vault){
    const [owner] = await ethers.getSigners();

    const nonce = await erc2612.nonces(owner.address);
    const deadline = Math.ceil(Date.now() / 1000) + 60 * 60 * 24;
    const chainID = (await ethers.provider.getNetwork()).chainId;

    // let amount = ethers.utils.parseUnits("1").toString();
    let amount = 100;
    // console.log(amount)

    const domain = {
        name : 'Etherloop',
        version : '1',
        chainId : chainID,
        verifyingContract : erc2612.address
    }
    const types = {
        Permit: [
          {name: "owner", type: "address"},
          {name: "spender", type: "address"},
          {name: "value", type: "uint256"},
          {name: "nonce", type: "uint256"},
          {name: "deadline", type: "uint256"}
        ]
    };
    const message = {
        owner: owner.address,
        spender: vault.address,
        value: amount,
        nonce: nonce,
        deadline: deadline
    };

    const signature = await owner._signTypedData(domain, types, message);
    const {v, r, s} = ethers.utils.splitSignature(signature);

    let tx = await vault.permitDeposit(
        erc2612.address,
        amount,
        deadline,
        v,
        r,
        s
    );
    tx.wait();
    
    let allowanced = await vault.getBalance(erc2612.address, owner.address);
    console.log("deposit balance:" + allowanced);
}

async function getBalance(vault){
    const [owner] = await ethers.getSigners();

    const balance_ = await vault.getBalance(erc2612_address, owner.address);
    console.log(`deposit balance:`,balance_);
}


async function main() {
    const erc2612 = await ethers.getContractAt("Etherloop_2612",erc2612_address);
    const vault = await ethers.getContractAt("Vault",vault_address);
    // await permitOffline(erc2612,vault);
    await getBalance(vault);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });