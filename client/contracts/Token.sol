//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

//creating token contract

contract Token {
    string public name = "DEFCOIN 1 Token";
    string public symbol = "DF1";
    uint256 public totalSupply = 1000000;
    //object mapping const balances ={ address(key): uint“value }
    mapping(address => uint256) balances;

    constructor() {
        //set balance to 1000000
        balances[msg.sender] = totalSupply;
    }

    // send to an adress, with the amount of tokens
    function transfer(address to, uint256 amount) external {
        //require the balance of the sender is greater or equal to the amount with error and stop fn
        require(balances[msg.sender] >= amount, "Not Enough Tokens");
        //substract the senders amount
        balances[msg.sender] -= amount;
        //send to the payee
        balances[to] += amount;
    }

    //sends value of user's address
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
