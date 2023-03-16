
//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;


contract Bank{
    mapping (address => uint) depositor;
    
    // 取款指定数量
    function withdraw(uint256 amount) payable public{           
        // 查询储户的余额
        uint256 balance = depositor[msg.sender];
        // 若余额不足提取，则抛出异常
        require(balance >= amount, "Insufficient balance!");
        // 余额扣除
        address payable accept = payable (msg.sender);
        depositor[accept] -= amount;
        // 若转账失败则补回余额
        if(!accept.send(amount)){
            depositor[accept] += amount;
        }
    }  

    // 取款
    function withdrawAll() payable public{
        // 查询用户余额
        uint256 balance = depositor[msg.sender];
        // 若余额不足，则抛出异常
        require(balance > 0, "Insufficient balance!");
        // 余额扣除
        address payable accept = payable (msg.sender);
        depositor[accept] = 0;
        // 若转账失败则补回余额
        if(!accept.send(balance)){
            depositor[accept] += balance;
        }
    }

    // 存款
    function deposit() public payable {
        require(msg.value > 0, "No Value!");
        depositor[msg.sender] += msg.value;
    }

    // 查询余额
    function getBalance() public view returns(uint){
        return depositor[msg.sender];
    }

}


