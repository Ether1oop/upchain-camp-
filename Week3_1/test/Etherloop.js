require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Etherloop", function () {
    let Etherloop;
    let etherloop;
    let Vault;
    let vault;
    let owner;

    beforeEach(async function(){
        Etherloop = await ethers.getContractFactory("Etherloop");
        etherloop = await Etherloop.deploy();
        await etherloop.deployed();

        [owner] = await ethers.getSigners();

        Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy();
        await vault.deployed(); 
    })


    describe("deposit by approve",function(){
        /**
         * 由owner调用ERC20开始授权，然后Vault调用存款
         */
        it("should deposit", async function(){
            // 进行授权与验证
            await etherloop.connect(owner).approve(vault.address, 1000);
            expect(await etherloop.allowance(owner.address, vault.address)).to.be.equal(1000);
            // 进行存款与验证
            await vault.connect(owner).deposit(etherloop.address, 1000);
            expect(await vault.getBalance(etherloop.address,owner.address)).to.be.equal(1000);

        });
    });

    describe("deposit by tokenReceived", async function(){
        /**
         * 由owner调用带回调的函数
         */
        it("should deposit", async function(){
            await etherloop.connect(owner).transferWithCallback(vault.address,1000);
            expect(await vault.getBalance(etherloop.address,owner.address)).to.be.equal(1000);
        })
    });

    describe("withdraw", async function(){
        it("should withdraw successfully",async function(){
            const _balance = await etherloop.balanceOf(owner.address);
            await etherloop.connect(owner).transferWithCallback(vault.address,1000);
            expect(await vault.getBalance(etherloop.address, owner.address)).to.be.equal(1000);
            expect(await etherloop.balanceOf(owner.address)).to.be.equal(_balance - 1000);

            await vault.connect(owner).withdraw(etherloop.address,1000);
            expect(await vault.getBalance(etherloop.address, owner.address)).to.be.equal(0);
            expect(await etherloop.balanceOf(owner.address)).to.be.equal(_balance);
        })
    })
});
