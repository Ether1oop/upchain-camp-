const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
require("@nomicfoundation/hardhat-network-helpers");
require('@openzeppelin/hardhat-upgrades');
const { expect } = require("chai");

describe("ERC20Upgrade",async function(){
    it("should upgrade successfully",async function(){
        const EtherloopV1 = await ethers.getContractFactory("EtherloopUpgrade");
        const etherloopV1 = await upgrades.deployProxy(EtherloopV1,["Etherloop","ELP"]);
        await etherloopV1.deployed();


        // 实现(逻辑)合约地址
        let implementation_address = await upgrades.erc1967.getImplementationAddress(etherloopV1.address);
        // 管理员地址
        let admin_address = await upgrades.erc1967.getAdminAddress(etherloopV1.address);
        console.log("Proxy address: \t\t" + etherloopV1.address);
        console.log("implementation address:\t" + implementation_address);
        console.log("admin_address:\t\t" + admin_address);


        // 升级
        const EtherloopV2 = await ethers.getContractFactory("EtherloopUpgradeV2");
        const etherloopV2 = await upgrades.upgradeProxy(etherloopV1.address,EtherloopV2);
        // 实现(逻辑)合约地址
        implementation_address = await upgrades.erc1967.getImplementationAddress(etherloopV1.address);
        // 管理员地址
        admin_address = await upgrades.erc1967.getAdminAddress(etherloopV1.address);
        
        console.log("Proxy address: \t\t" + etherloopV2.address);
        console.log("implementation address:\t" + implementation_address);
        console.log("admin_address:\t\t" + admin_address);
    });

})