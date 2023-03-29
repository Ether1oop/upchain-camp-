// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Etherloop_721 is ERC721URIStorage{
    Counters.Counter private _tokenIDs;

    constructor()ERC721("Etherloop","ETL"){}

    //ipfs://QmNR8RZfdALnEtU4WCA2jdyquErDJynKZkbLUdf8QAed7N
    function mint(address to, string memory tokenURI) public returns (uint256){
        Counters.increment(_tokenIDs);

        uint256 newItemId = Counters.current(_tokenIDs);
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

}
