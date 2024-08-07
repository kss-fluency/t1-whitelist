// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserBalance {
    mapping(address => uint256) private ethBalances;
    mapping(address => mapping (address => uint256)) private erc20balances;
    mapping(address => bool) public whitelist;

    constructor(address whitelisted){
        whitelist[whitelisted] = true;
    }

    function changeEthBalance(address userToChange, int256 amount) external onlyWhitelisted {
        require(-amount <= int256(ethBalances[userToChange]), "You are trying to reduce balance by higher amount than it is");

        _changeEthBalance(userToChange, amount);
    }

    function getEthBalance(address user) external view onlyWhitelisted returns(uint256)  {
        return ethBalances[user];
    }

    function changeERC20balance(address erc20coin, address userToChange, int256 amount) external onlyWhitelisted {
        require(-amount <= int256(erc20balances[erc20coin][userToChange]), "You are trying to reduce balance by higher amount than it is");

        _changeERC20balance(erc20coin, userToChange, amount);
    }

    function getERC20balance(address erc20coin, address user) external view onlyWhitelisted returns(uint256)  {
        return erc20balances[erc20coin][user];
    }

    function addToWhitelist(address newWhitelisted) external onlyWhitelisted {
        require(!whitelist[newWhitelisted], "This address is already whitelisted");

        _addToWhitelist(newWhitelisted);
    }

    function _changeEthBalance(address userToChange, int256 amount) private {
        ethBalances[userToChange] = uint256(int256(ethBalances[userToChange]) + amount);
    }

    function _changeERC20balance(address erc20coin, address userToChange, int256 amount) private {
        erc20balances[erc20coin][userToChange] = uint256(int256(erc20balances[erc20coin][userToChange]) + amount);
    }

    function _addToWhitelist(address newWhitelisted) private {
        whitelist[newWhitelisted] = true;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Caller address is not whitelisted");
        _;
    }
}
