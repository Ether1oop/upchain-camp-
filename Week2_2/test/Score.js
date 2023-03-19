const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Score", function () {
    async function deployScore() {
        const [deposit_1, deposit_2] = await ethers.getSigners();
        const Score = await ethers.getContractFactory("Score");
        const score = await Score.deploy();
        return { score, deposit_1, deposit_2 };
    }

    describe("Constructor",function(){
        it("should record the owner",async function(){
            const {score,deposit_1} = await loadFixture(deployScore);
            expect(await score.getOwner()).to.be.equal(deposit_1.address);
        })
    });

    describe("setTeacher",function(){
        it("should be setted by owner",async function(){
            const {score,deposit_1} = await loadFixture(deployScore);
            expect(await score.setTeacher(deposit_1.address)).not.to.be.reverted;
            expect(await score.getTeacher()).to.be.equal(deposit_1.address);
        })

        it("should not be setted by other address", async function(){
            const {score,deposit_1,deposit_2} = await loadFixture(deployScore);
            await expect(score.connect(deposit_2).setTeacher(deposit_1.address)).to.be.revertedWith("Only owner can set teacher address!");
        })
    });

    describe("setScore",function(){
        it("set successfully by teacher",async function(){
            const {score, deposit_1,deposit_2} = await loadFixture(deployScore);
            // 先设置teacher地址
            await score.setTeacher(deposit_2.address);
            // 验证地址是否被设置正确
            expect(await score.getTeacher()).to.be.equal(deposit_2.address);
            // 使用teacher地址调用setScore
            await expect(score.connect(deposit_2).setScore(deposit_1.address,99)).not.to.be.reverted;
            expect(await score.getScore(deposit_1.address)).to.be.equal(99);
        });

        it("set unsuccessfully by other address",async function(){
            const {score, deposit_1,deposit_2} = await loadFixture(deployScore);
            // 先设置teacher地址
            await score.setTeacher(deposit_2.address);
            // 验证地址是否被设置正确
            expect(await score.getTeacher()).to.be.equal(deposit_2.address);
            // 使用其他地址调用,应该抛出异常
            await expect(score.setScore(deposit_1.address,99)).to.be.revertedWith("No permission");
            
        });

        it("score should blow 100 points",async function(){
            const {score, deposit_1,deposit_2} = await loadFixture(deployScore);
            // 先设置teacher地址
            await score.setTeacher(deposit_2.address);
            // 验证地址是否被设置正确
            expect(await score.getTeacher()).to.be.equal(deposit_2.address);
            // 使用teacher地址调用setScore
            await expect(score.connect(deposit_2).setScore(deposit_1.address,200)).to.be.reverted;
        })
    });
    
});
