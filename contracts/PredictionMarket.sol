// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interface to interact with Flare FTSO V2 (Coston2)
interface IFTSO {
    function getCurrentPrice(bytes21 _ftsoId) external view returns (uint256);
}

contract PredictionMarket {
    struct Market {
        string question;
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

    IFTSO public ftso; // Flare FTSO oracle

    // Feed ID for ETH/USD on Coston2 (in bytes21)
    bytes21 constant ETH_USD_ID = bytes21(0x014554482f55534400000000000000000000000000);

    constructor(address _ftsoAddress) {
        owner = msg.sender;
        ftso = IFTSO(_ftsoAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Create a new prediction market
    function createMarket(string calldata _question, uint256 _durationInSeconds) external onlyOwner {
        Market storage m = markets[marketCount++];
        m.question = _question;
        m.endTime = block.timestamp + _durationInSeconds;
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

    /// @notice Resolve the market with given outcome
    function resolveMarket(uint256 marketId, bool outcome) external onlyOwner {
        Market storage m = markets[marketId];
        require(block.timestamp >= m.endTime, "Market not ended");
        require(!m.resolved, "Already resolved");
        m.outcome = outcome;
        m.resolved = true;
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

    /// @notice Get ETH/USD price from Flare FTSO
    function getEthUsd() public view returns (uint256) {
        return ftso.getCurrentPrice(ETH_USD_ID); // returns price with 1e8 decimals
    }

    /// @notice Convert to GEL/ETH using front-provided USD/GEL rate
    /// @param usdPerGel Price of 1 GEL in USD * 1e8 (passed from frontend)
    function getGelPerEth(uint256 usdPerGel) public view returns (uint256) {
        uint256 ethUsd = getEthUsd(); // ETH/USD price from oracle
        return (ethUsd * 1e8) / usdPerGel; // returns GEL/ETH * 1e8
    }

    /// @notice Get pools for frontend display
    function getPools(uint256 marketId) external view returns (uint256 yes, uint256 no) {
        Market storage m = markets[marketId];
        return (m.yesPool, m.noPool);
    }

    /// @notice Fallback to receive ETH
    receive() external payable {}
}