const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Teacher", function(){
    async function deployScore() {
        const Score = await ethers.getContractFactory("Score");
        const score = await Score.deploy();
        return { score };
    }

    describe("callSetScore",function(){
        it("should call successfully",async function(){
            // 先部署Score
            const [singer_1,singer_2] = await ethers.getSigners();
            const score = await loadFixture(deployScore);
            const score_address = score.score.address;
            // 获得Score地址后,用于初始化Teacher
            const Teacher = await ethers.getContractFactory("Teacher");
            const teacher = await Teacher.deploy(score_address);
            await teacher.deployed();

            console.log(teacher);

            // 调用score.setTeacher()来设置score的teacher地址
            expect(await score.setTeacher(teacher.address)).not.to.be.reverted;
            expect(await score.getTeacher()).to.be.equal(teacher.address);

            await expect(teacher.callSetScore(singer_2.address,100)).not.to.be.reverted;
            expect(await teacher.getScore(singer_2.address)).to.be.equal(100);

        })

    })
});