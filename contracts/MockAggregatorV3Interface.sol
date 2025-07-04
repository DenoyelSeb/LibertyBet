// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockAggregatorV3Interface {
    int256 public price = 3000 * 1e8; // 3000$ (8 decimals)

    function setPrice(int256 _price) external {
        price = _price;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80, int256, uint256, uint256, uint80
        )
    {
        return (0, price, 0, 0, 0);
    }
}