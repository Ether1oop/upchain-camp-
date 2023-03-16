const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { ethers } = require("hardhat");
  const { expect } = require("chai");
  
  describe("Bank", function () {
      async function deployOneYearLockFixture() {
          const [deposit_1, deposit_2] = await ethers.getSigners();
          const Bank = await ethers.getContractFactory("Bank");
          const bank = await Bank.deploy();
  
          return { bank, deposit_1, deposit_2 };
      }
  
      describe("deposit", function(){
        it("should deposit successfully", async function(){
            const {bank,deposit_1, deposit_2} = await loadFixture(deployOneYearLockFixture);
            // 向地址进行转账，并且检查他们的余额
            await bank.deposit({value : ethers.utils.parseEther("1")});
            expect(await bank.getBalance()).to.equal( ethers.utils.parseEther("1"));

            await bank.connect(deposit_2).deposit({value: ethers.utils.parseEther("2")});
            expect(await bank.connect(deposit_2).getBalance()).to.equal( ethers.utils.parseEther("2"));
        });
      });

      describe("withdraw", function(){
        it("should withdraw specified amount", async function () {
            const {bank,deposit_1, deposit_2} = await loadFixture(deployOneYearLockFixture);

            // 存款
            await bank.deposit({ value: ethers.utils.parseEther("2") });

            // 取款
            await bank.withdraw(ethers.utils.parseEther("1"));
        
            // 验证余额是否正确
            expect(await bank.getBalance()).to.equal(ethers.utils.parseEther("1"));
          });

          it("should not withdraw more than the balance", async function () {
            const {bank,deposit_1, deposit_2} = await loadFixture(deployOneYearLockFixture);

            // 存款
            await bank.deposit({ value: ethers.utils.parseEther("1") });
        
            // 尝试取款超过余额的金额
            await expect(bank.withdraw(ethers.utils.parseEther("2"))).to.be.revertedWith(
              "Insufficient balance!"
            );
        
            // 验证余额是否正确
            expect(await bank.getBalance()).to.equal(ethers.utils.parseEther("1"));
          });

          it("should withdraw all balance", async function () {
            const {bank,deposit_1, deposit_2} = await loadFixture(deployOneYearLockFixture);

            // 存款
            await bank.deposit({ value: ethers.utils.parseEther("1") });
        
            // 取款
            await bank.withdrawAll();
        
            // 验证余额是否正确
            expect(await bank.getBalance()).to.equal(0);
          });
      });



  });