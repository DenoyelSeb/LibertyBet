// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/AggregatorV3Interface.sol";

contract PredictionMarket {
    struct Market {
        string question;
        int256 targetPrice; // ex: 3000 * 1e8
        uint256 endTime;
        uint256 yesPool;
        uint256 noPool;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
        bool resolved;
        bool outcome; // true = yes wins, false = no wins
    }

    address public owner;
    uint256 public marketCount;
    mapping(uint256 => Market) public markets;

    AggregatorV3Interface public priceFeed;

    event MarketCreated(uint256 indexed marketId, string question, int256 targetPrice, uint256 endTime);
    event MarketResolved(uint256 indexed marketId, bool outcome, int256 resolvedPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _priceFeed) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /// @notice Create a new prediction market
    function createMarket(
        string calldata _question,
        int256 _targetPrice,
        uint256 _durationInSeconds
    ) external onlyOwner {
        Market storage m = markets[marketCount++];
        m.question = _question;
        m.targetPrice = _targetPrice;
        m.endTime = block.timestamp + _durationInSeconds;
        emit MarketCreated(marketCount - 1, _question, _targetPrice, m.endTime);
    }

    /// @notice Bet on "Yes"
    function betYes(uint256 marketId) external payable {
        Market storage m = markets[marketId];
        require(block.timestamp < m.endTime, "Market closed");
        m.yesPool += msg.value;
        m.yesBets[msg.sender] += msg.value;
    }

    /// @notice Bet on "No"
    function betNo(uint256 marketId) external payable {
        Market storage m = markets[marketId];
        require(block.timestamp < m.endTime, "Market closed");
        m.noPool += msg.value;
        m.noBets[msg.sender] += msg.value;
    }

    /// @notice Resolve the market with Chainlink price feed
    function resolveMarket(uint256 marketId) external onlyOwner {
        Market storage m = markets[marketId];
        require(block.timestamp >= m.endTime, "Market not ended");
        require(!m.resolved, "Already resolved");

        int256 price = getEthUsd();
        m.outcome = price >= m.targetPrice; // "Yes" wins if price >= target
        m.resolved = true;
        emit MarketResolved(marketId, m.outcome, price);
    }

    /// @notice Claim reward after resolution
    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.resolved, "Not resolved");

        uint256 payout = 0;

        if (m.outcome) {
            uint256 userBet = m.yesBets[msg.sender];
            require(userBet > 0, "No winning bet");
            payout = (userBet * (m.yesPool + m.noPool)) / m.yesPool;
            m.yesBets[msg.sender] = 0;
        } else {
            uint256 userBet = m.noBets[msg.sender];
            require(userBet > 0, "No winning bet");
            payout = (userBet * (m.yesPool + m.noPool)) / m.noPool;
            m.noBets[msg.sender] = 0;
        }

        payable(msg.sender).transfer(payout);
    }

    /// @notice Get latest ETH/USD price from Chainlink (8 decimals)
    function getEthUsd() public view returns (int256) {
    (
        , // uint80 roundID
        int256 price,
        , // uint256 startedAt
        , // uint256 updatedAt
        // uint80 answeredInRound
    ) = priceFeed.latestRoundData();
    return price; // 8 decimals (for ETH/USD on Sepolia)
}


    /// @notice Get pools for frontend display
    function getPools(uint256 marketId) external view returns (uint256 yes, uint256 no) {
        Market storage m = markets[marketId];
        return (m.yesPool, m.noPool);
    }

    receive() external payable {}
}