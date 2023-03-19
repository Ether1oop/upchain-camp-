// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IScore {
    function setScore(address student, uint256 fraction) external;
    function getScore(address student) external view returns (uint);
}

contract Teacher{
    IScore teacher;

    constructor(address score_address){
        teacher = IScore(score_address);
    }

    function callSetScore(address student, uint256 score) public {
        teacher.setScore(student, score);
    }   
    
    function getScore(address student) public view returns(uint){
        return teacher.getScore(student);
    }
}
