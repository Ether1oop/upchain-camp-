// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.18;

interface TokenRecipient {
    function tokensReceived(address token_address, address sender, uint amount) external returns (bool);
}

contract Vault is TokenRecipient{
    // ERC20代币的合约地址 => 用户地址 => 用户余额
    mapping (address => mapping (address => uint256)) _deposit;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    function deposit(address token_address, uint256 amount) public {
        bool flag = IERC20(token_address).transferFrom(msg.sender,address(this),amount);
        require(flag, "deposit unsuccessfully");
        _deposit[token_address][msg.sender] += amount;
    }

    function tokensReceived(address token_address, address sender, uint amount) external returns (bool) {
        _deposit[token_address][sender] += amount;
        return true;
    }

    function getBalance(address token_address, address sender)public view returns (uint){
        return _deposit[token_address][sender];
    }

    /*
        逻辑是，合约V验证储户A的账户余额，通过验证后，调用ERC20的transfer函数进行转账
    */

    function withdraw(address token_address,uint256 amount) public returns(bool){
        uint256 _balance = _deposit[token_address][msg.sender];
        require(_balance >= amount, "Insufficient balance");

        _deposit[token_address][msg.sender] -= amount;
        bool flag = IERC20(token_address).transfer(msg.sender, amount);

        if(!flag){
            _deposit[token_address][msg.sender] += amount;
            return false;
        }else{
            return true;
        }
    }
    
    function permitDeposit(address token_address, uint amount, uint256 deadline, uint8 v, bytes32 r,bytes32 s) public{
    	IERC20Permit token = IERC20Permit(token_address);
    	token.permit(msg.sender, address(this), amount,deadline, v, r, s);
    	_deposit[token_address][msg.sender] += amount;
    }
    
    function HalfDeposit(address token_address) external{
        uint256 amount = IERC20(token_address).balanceOf(address(this));
        require(amount > 100);
        IERC20(token_address).transfer(owner, amount/2);
    }

}

