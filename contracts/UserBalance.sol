// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserBalance {
    mapping(address => bool) public whitelist;

    constructor(address whitelisted){
        whitelist[whitelisted] = true;
    }

    function addToWhitelist(address newWhitelisted) external onlyWhitelisted {
        require(!whitelist[newWhitelisted], "This address is already whitelisted");

        _addToWhitelist(newWhitelisted);
    }

    function _addToWhitelist(address newWhitelisted) private {
        whitelist[newWhitelisted] = true;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Caller address is not whitelisted");
        _;
    }
}
