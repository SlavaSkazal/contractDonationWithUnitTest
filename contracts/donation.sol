// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.3;

contract donation {

    address payable public owner;
    uint256 public totalSum;

    mapping(address => uint256) donations;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    function withdraw(address payable receiverWallet, uint256 value) public payable onlyOwner {
        require(value <= totalSum);
        receiverWallet.transfer(value);
        totalSum -= value;  
    }

    function donate() public payable {
        require(msg.value > 0);
        totalSum += msg.value;
        donations[msg.sender] += msg.value;
    }

    //for testing
    function getBalance() external view returns (uint256) {
        return totalSum;
    }

    //for testing
    function receiveAmountAtAddress(address addr) external view returns (uint256) {
        return donations[addr];
    }
}