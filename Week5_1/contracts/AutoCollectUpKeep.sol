pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./automation/AutomationCompatible.sol";


interface Vault {
    function HalfDeposit(address token_address) external;
}

contract AutoCollectUpKeep is AutomationCompatible {
  address public immutable token;
  address public immutable bank;

  constructor() {
        token = 0xEbe8a4970931e091F310f0140b105B70dD761740;
        bank = 0xA32cbEA260814e15834451932B8E9f36da48Ad8d;

  }

  function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
    // upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    
    if(IERC20(token).balanceOf(bank) > 100) {
      upkeepNeeded = true;
    }

    // performData = abi.decode();
  }


  function performUpkeep(bytes calldata performData) external override {
    if(IERC20(token).balanceOf(bank) > 100) {
      Vault(bank).HalfDeposit(token);
    }
  }

}
