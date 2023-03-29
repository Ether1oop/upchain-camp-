require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721",async function(){
    let erc20;
    let erc721;
    let nftMarket;
    let owner;
    let other_account;

    this.beforeEach(async function(){
        [owner,other_account] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("Etherloop");
        erc20 = await ERC20.deploy();
        await erc20.deployed();

        const ERC721 = await ethers.getContractFactory("Etherloop_721");
        erc721 = await ERC721.deploy();
        await erc721.deployed();

        // const NFTMarket = await ethers.getContractFactory("NFTMarket");
        // nftMarket = await NFTMarket.deploy();
        // await nftMarket.deployed();
    })

    describe("test ERC721 mint",async function(){
        it("mint",async function(){
            erc721.mint(owner.address,"ipfs://QmNR8RZfdALnEtU4WCA2jdyquErDJynKZkbLUdf8QAed7N");
            expect(await erc721.balanceOf(owner.address)).to.be.equal(1);
        })
    })

    describe("test NFTMarket",async function(){
        it("should list",async function(){
            erc721.mint(owner.address,"ipfs://QmNR8RZfdALnEtU4WCA2jdyquErDJynKZkbLUdf8QAed7N");
            expect(await erc721.balanceOf(owner.address)).to.be.equal(1);

            const NFTMarket = await ethers.getContractFactory("NFTMarket");
            nftMarket = await NFTMarket.deploy(erc20.address,erc721.address);
            await nftMarket.deployed();
            
            // 先授权，再把nft转到合约里
            await erc721.approve(nftMarket.address,1);
            expect(await erc721.getApproved(1)).to.be.equal(nftMarket.address);
            // 转移
            await nftMarket.list(1,1000);
            expect(await nftMarket.getAmount(1)).to.be.equal(1000);
        });

        it("should buy",async function(){
            erc721.mint(owner.address,"ipfs://QmNR8RZfdALnEtU4WCA2jdyquErDJynKZkbLUdf8QAed7N");
            expect(await erc721.balanceOf(owner.address)).to.be.equal(1);

            const NFTMarket = await ethers.getContractFactory("NFTMarket");
            nftMarket = await NFTMarket.deploy(erc20.address,erc721.address);
            await nftMarket.deployed();
            
            // 先授权，再把nft转到合约里
            await erc721.approve(nftMarket.address,1);
            expect(await erc721.getApproved(1)).to.be.equal(nftMarket.address);
            // 转移
            await nftMarket.list(1,1000);
            expect(await nftMarket.getAmount(1)).to.be.equal(1000);

            // 先转点token给other_account
            await erc20.transfer(other_account.address, 2000);
            expect(await erc20.balanceOf(other_account.address)).to.be.equal(2000);

            // 然后再授权、购买。
            await erc20.connect(other_account).approve(nftMarket.address,2000);
            expect(await erc20.allowance(other_account.address, nftMarket.address)).to.be.equal(2000);

            await nftMarket.connect(other_account).buy(1,2000);
            expect(await erc721.ownerOf(1)).to.be.equal(other_account.address);
        })
    })
})