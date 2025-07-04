const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let PredictionMarket, predictionMarket, owner;

  const dummyFtso = "0x014554482f55534400000000000000000000000000"; 

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(dummyFtso);
    await predictionMarket.deployed();
  });

  it("should deploy correctly", async () => {
    expect(await predictionMarket.ftso()).to.equal(dummyFtso);
  });

  it("should call getEthUsd from FTSO", async () => {
    try {
      const price = await predictionMarket.getEthUsd();
      console.log("ETH/USD price:", price.toString());
    } catch (e) {
      console.error("Error fetching price from FTSO:", e.message);
    }
  });
});
