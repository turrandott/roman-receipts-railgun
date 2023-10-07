// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcceptPayments {
    
    // The owner of the contract
    address public owner;

    // Event to notify whenever a payment is received
    event PaymentReceived(address from, uint256 amount);

    // Set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to ensure only the owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Function to deposit Ether into the contract
    function deposit() public payable {
        require(msg.value > 0, "Must send a positive amount");
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Withdraw all funds from the contract to the owner
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Returns the contract's Ether balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
