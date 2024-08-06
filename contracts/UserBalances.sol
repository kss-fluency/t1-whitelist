// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserBalances {
    mapping(address => bool) private whitelist;
    constructor(address whitelisted){
        whitelist[whitelisted] = true;
    }
}
