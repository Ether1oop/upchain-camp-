// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarket is IERC721Receiver{
    // tokenid => price
    mapping (uint => uint) public token_price;
    address public immutable erc20;
    address public immutable nft;

    constructor(address token_address, address nft_address){
        erc20 = token_address;
        nft = nft_address;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
      return this.onERC721Received.selector;
    }

    function list(uint tokenId, uint amount) public {
        IERC721(nft).safeTransferFrom(msg.sender, address(this), tokenId,"");
        token_price[tokenId] = amount;
    }

    function buy(uint token_id, uint amount) public {
        require(amount > token_price[token_id],"amount is not enough");
        address nft_owner = IERC721(nft).ownerOf(token_id);
        require(nft_owner == address(this),"aleady selled");
        // 这里如果使用transfer，则是market合约调用erc20的转账，会将erc20的token转给erc20
        IERC20(erc20).transferFrom(msg.sender, address(this),token_price[token_id]);
        IERC721(nft).transferFrom(address(this), msg.sender, token_id);
    }

    function getAmount(uint tokenId) public view returns(uint){
        return token_price[tokenId];
    }
}