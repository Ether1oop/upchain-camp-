const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Counter", function () {
    async function deployOneYearLockFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Lock = await ethers.getContractFactory("Counter");
        const lock = await Lock.deploy();

        return { lock, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right count and owner",async function(){
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            // 检查部署后，count的初始值是否为0
            expect(await lock.getCount()).to.equal(0);
            // 检查部署后，owner的值是否为当前部署地址
            expect(await lock.getOwner()).to.equal(owner.address);
        });
    });

    describe("Count",function(){
        it("Should be called by the owner", async function(){
            const {lock,owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
            // 使用断言检查owner调用是否抛出异常
            expect(await lock.connect(owner).addCount(1)).to.be.reverted;
            // 检查count的值是否被修改为1
            expect(await lock.getCount()).to.equal(1);
            // 使用断言检查其他地址调用是否抛出异常
            try {
                await lock.connect(otherAccount).addCount(2);
            } catch (error) {
                console.log("Caught revert error:", error.message);
            }
        });
    })

});
