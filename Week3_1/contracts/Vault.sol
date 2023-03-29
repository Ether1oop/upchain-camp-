// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.18;

interface TokenRecipient {
    function tokensReceived(address token_address, address sender, uint amount) external returns (bool);
}

contract Vault is TokenRecipient{
    // ERC20代币的合约地址 => 用户地址 => 用户余额
    mapping (address => mapping (address => uint256)) _deposit;

    /*
        最直接的存token的方法：
            1、首先，储户A调用ERC20合约的transfer()函数，给Vault合约进行转账
            2、其次，储户A修改_deposit状态变量，记录存款

            存在的问题：储户A可以不调用ERC20合约的transfer()函数，而直接向Vault存钱。
            解决办法：
                    1、在修改_deposit状态变量之前，调取ERC20合约的event，检查是否有储户A的地址向Vault合约转过一笔钱。
                    2、借用ERC20的approve函数。
                        ERC20的授权逻辑如下：
                            2.1 储户A可以为目标账户或合约V，开放一个额度，如同开了一张支票。
                            2.2 目标账户或合约V，首先需要去ERC20代币合约去验证一下，这张支票是否是真的。
                                如果是真的，就意味着合约V可以凭借这一张支票，去ERC20代币那里提取token到自己的地址下。
                            2.3 与现实世界支票不同的是，在V没有使用完额度之前，这张支票的额度是可以随时改变的，用以最大程度保护储户A的安全
                        我们在上面提到，储户A在向Vault存款时，Vault必须要验证一下，是否有一笔token从储户A转向了Vault。
                        而在ERC20授权逻辑下，当储户A为合约V开放额度（开了一张支票）的时候，其实就意味着一定额度的token的所有权从储户A转移到了合约V。
                        此时，即使合约V不提取这部分token，这部分的token也算在了合约V的账上。
                        于是，储户A就可以向Vault合约提出存款，而Vault合约也必须验证一下是否有一笔token从储户A转向了Vault。
                        Vault合约只需要检查一下ERC20合约里面的_allowance变量，检查一下储户A给的这张支票，是否是真的，是否合法。
                        如果是合法的，那么Vault合约就修改_deposit变量来记录储户A的存款，并且将这张支票兑现————通过transferFrom()转给自己。
    */


    /*
        方式一实现存token（有授权）：
            1、首先，由储户A调用ERC20合约，给Vault合约授权————指定有多少token是可以被转移的
            2、其次，由储户A通过编写合约函数deposit()，来调用ERC20的transferFrom()函数————调用transferFrom()函数的必须是当前Vault合约
                transferFrom()实现了：
                    扣除_allowances[A.address][Valut.address]的余额；
                    调用_transfer(A.address,Valut.address,amount)给Vault合约地址转钱。
            3、最后，若上述操作全部成功，则修改Vault合约的deposit变量
    */
    function deposit(address token_address, uint256 amount) public {
        bool flag = IERC20(token_address).transferFrom(msg.sender,address(this),amount);
        require(flag, "deposit unsuccessfully");
        _deposit[token_address][msg.sender] += amount;
    }


    /*
        方式二实现存token（无授权）：
            对于方式一的方法，储户A需要调用两笔交易————一笔是ERC20的授权函数、一笔是Vault的存款函数。存一次款需要两笔交易，无形之中带来了额外的gas花销。
            有没有办法可以一次存取呢？

            储户A向合约V的存款逻辑是：A告诉V，钱转过去了；V检查了下，确实转过来了；V进行记账
            需要两次调用的原因是，合约无法发起主动的调用，也就是说，当A告知V钱转过去的时候，V并不知道你转没转过去，你需要告知V，让他去验证。
            这中间我们做了两次告知：A->ERC20(发起转账);A->V->ERC20(A告知V存了钱,并让他去验证)
            那我们一次存取就意味着，做一次告知：A->ERC20->V（由ERC20告诉V，储户A在你那里存了钱）。

            所以我们要在ERC20代币合约中增加一个功能：通知合约V，记录一下储户A的存款，因为储户A确实把token转到你的地址了。
            这个功能有两个思路：
                1、由ERC20合约调用Vault的存款功能。
                2、实现一个共同的interface
            这两个思路的效果应该是一样的，但是区别在于：
                思路一的实现中，Vault应该优先于ERC20代币合约实现，因为ERC20合约需要调用Vault的存款功能————需要知道它的ABI接口
                思路二的实现中，Vault和ERC20代币合约的实现是没有依赖关系的，可以同时进行，因为有一个共同的规定好的interface
    */
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
        require(_balance >= amount, unicode"Insufficient balance！");

        _deposit[token_address][msg.sender] -= amount;
        bool flag = IERC20(token_address).transfer(msg.sender, amount);

        if(!flag){
            _deposit[token_address][msg.sender] += amount;
            return false;
        }else{
            return true;
        }
    }
    
    function permitDeposit(address token_address, uint amount, uint256 deadline, uint8 v, bytes32 r,bytes32 s)public{
    	IERC20Permit token = IERC20Permit(token_address);
    	token.permit(msg.sender, address(this), amount,deadline, v, r, s);
    	_deposit[token_address][msg.sender] += amount;
    }
    
}

