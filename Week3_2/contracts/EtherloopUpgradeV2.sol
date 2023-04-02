
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address token_address, address sender, uint amount) external returns (bool);
}


contract EtherloopUpgradeV2 is ERC20Upgradeable{

    function initialize(string memory _name, string memory _symbol) public onlyInitializing{
        __ERC20_init(_name,_symbol);
        _mint(msg.sender, 100000 * 10 ** 18);
    }

    function transferWithCallback(address to, uint256 amount) public returns(bool){
        transfer(to, amount);

        if(Address.isContract(to)){
            bool returnValue = TokenRecipient(to).tokensReceived(address(this), msg.sender, amount);
            require(returnValue, "Call Back failed!");
        }
        return true;
    }
}
