const hre = require("hardhat");
const { expect } = require("chai");

describe("PredictionMarket", function () {
  let owner, mockPriceFeed, PredictionMarket, predictionMarket;

  beforeEach(async () => {
    [owner] = await hre.ethers.getSigners();

    // Deploy MockPriceFeed
    const MockPriceFeed = await hre.ethers.getContractFactory("MockPriceFeed");
    mockPriceFeed = await MockPriceFeed.deploy();
    await mockPriceFeed.waitForDeployment();

    // Deploy PredictionMarket with address of MockPriceFeed
    PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(await mockPriceFeed.getAddress());
    await predictionMarket.waitForDeployment();
  });

  it("should deploy correctly", async () => {
    expect(await predictionMarket.owner()).to.equal(owner.address);
  });

  it("should call getEthUsd and get the mock value", async () => {
    const price = await predictionMarket.getEthUsd();
    expect(price).to.equal("200000000000"); // 2000e8
  });

  it("should update price in mock and get the new value", async () => {
    await mockPriceFeed.setLatestAnswer(3131e8);
    const price = await predictionMarket.getEthUsd();
    expect(price).to.equal("313100000000"); // 3131e8
  });
});
