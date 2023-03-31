// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Address.sol";
// import "openzeppelin-contracts/contracts/utils/Address.sol";


interface TokenRecipient {
    function tokensReceived(address token_address, address sender, uint amount) external returns (bool);
}


contract Etherloop_2612 is ERC20Permit{
    constructor() ERC20("Etherloop", "ELP") ERC20Permit("Etherloop"){
        _mint(msg.sender, 100000 * 10 ** 2);
    }

    // transferWithCallback是一种
    function transferWithCallback(address to, uint256 amount) public returns(bool){
        transfer(to, amount);

        if(Address.isContract(to)){
            bool returnValue = TokenRecipient(to).tokensReceived(address(this), msg.sender, amount);
            require(returnValue, "Call Back failed!");
        }
        return true;
    }

}

