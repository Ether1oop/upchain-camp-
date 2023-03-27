require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Etherloop_2612", function () {
    let etherloop;
    let vault;
    let owner;

    beforeEach(async function(){
        const Etherloop = await ethers.getContractFactory("Etherloop_2612");
        etherloop = await Etherloop.deploy();
        await etherloop.deployed();

        [owner] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy();
        await vault.deployed(); 
    })

    describe("test sign offline", async function(){
        it("deposit by permit",async function(){
            /**
             * 签名的发起者：owner
             * ERC20Permit地址：etherloop.address
             * 由vault合约调用permit函数进行验证签名
             */
            const nonce = await etherloop.nonces(owner.address);
            const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
            const chainId = (await ethers.provider.getNetwork()).chainId;

            const domain = {
                name: 'Etherloop', 
                version: '1', 
                chainId: chainId, 
                verifyingContract: etherloop.address
            }
    
            const message = {
                owner: owner.address, 
                spender: vault.address, 
                value: 100, 
                nonce: nonce, 
                deadline: deadline,
            };

            const types = {
                Permit: [
                    {name: "owner", type: "address"}, 
                    {name: "spender", type: "address"}, 
                    {name: "value",type: "uint256"}, 
                    {name: "nonce", type: "uint256"}, 
                    {name: "deadline", type: "uint256"},
                ],
            };

            const signature = await owner._signTypedData(domain, types, message);
            const {v, r, s} = ethers.utils.splitSignature(signature);

            await vault.permitDeposit(etherloop.address,100, deadline, v, r, s);
            expect(await vault.getBalance(etherloop.address, owner.address)).to.be.equal(100);
        })
    })
});