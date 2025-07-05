// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockPriceFeed {
    int256 public latestAnswer = 2000e8; // ex: 2000 USD, 8 décimales

    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256 answer,
            uint256,
            uint256,
            uint80
        )
    {
        return (0, latestAnswer, 0, 0, 0);
    }

    function setLatestAnswer(int256 _price) external {
        latestAnswer = _price;
    }
}