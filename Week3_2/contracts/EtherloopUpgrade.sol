
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract EtherloopUpgrade is ERC20Upgradeable{

    function initialize(string memory _name, string memory _symbol) public initializer{
        __ERC20_init(_name,_symbol);
        _mint(msg.sender, 100000 * 10 ** 18);
    }
}
