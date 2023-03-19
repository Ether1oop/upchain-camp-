// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


contract Score{
    error ExceedScore();

    mapping (address => uint256) score;
    address teacher;
    address owner;

    constructor(){
        owner = msg.sender;
    }

    modifier setScorePermission(){
        require(msg.sender == teacher, "No permission");
        _;
    }

    modifier setTeacherPermission(){
        require(msg.sender == owner,"Only owner can set teacher address!");
        _;
    }

    function setTeacher(address _teacher) public setTeacherPermission{
        teacher = _teacher;
    }

    function setScore(address student, uint256 fraction) public setScorePermission{
        if(fraction > 100){
            revert ExceedScore();
        }else{
            score[student] = fraction;
        }
    }
    
    function getOwner() public view returns(address){
    	return owner;
    }
    
    function getTeacher() public view returns(address){
    	return teacher;
    }
    
    function getScore(address student) public view returns(uint256){
    	return score[student];
    }
}
