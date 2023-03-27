//0x06B8CA53d6983Eb7cd4BBf13Ef7DE9cdCCc3fB37

const hre = require("hardhat");

const nftMarket_address = "0xA7A7d608Faf6984A73299e382C56a217c80c927e";
const erc721_address = "0x06B8CA53d6983Eb7cd4BBf13Ef7DE9cdCCc3fB37";

async function mint(){
    const [owner,other_account] = await ethers.getSigners();
    const erc721 = await ethers.getContractAt("Etherloop_721",erc721_address);
    erc721.mint(owner.address,"ipfs://QmNR8RZfdALnEtU4WCA2jdyquErDJynKZkbLUdf8QAed7N");
}

async function listAndBuy(){
    const [owner,other_account] = await ethers.getSigners();
    // 先铸造一个NFT
    const erc721 = await ethers.getContractAt("Etherloop_721",erc721_address);
    const nftMarket = await ethers.getContractAt("NFTMarket",nftMarket_address);

    // 授权NFTMarket合约
    const price = 1000;
    erc721.approve(nftMarket_address,price);
    nftMarket.list(1,price);

    // 转点给other_account
    erc20.transfer(other_account,2000);

    // other_account 授权给market合约购买
    erc20.connect(other_account).approve(nftMarket_address,2000);
    nftMarket.connect(other_account).buy(1,2000);

}

async function main() {
    mint();
    // listAndBuy();
    
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });