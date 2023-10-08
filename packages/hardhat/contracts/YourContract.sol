// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcceptPayments {

    uint256 public requestId;
    address public player;
    uint128 public amount;
    uint128 public payout;

    constructor() {
        requestId = 0;
        player = msg.sender;
        amount = 5000000;
        payout = 10000000;
    }
    
    event GameResultFulfilled(
        uint256 indexed _requestId,
        address indexed _player,
        uint128 _amount,
        uint128 _payout
    );
    
    // Returns the contract's Ether balance
    function emitEvent() public {
        emit GameResultFulfilled(requestId, player, amount, payout);
    }
}
