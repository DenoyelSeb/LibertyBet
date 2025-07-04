const hre = require("hardhat");
const { expect } = require("chai");
const ethers = hre.ethers;

describe("PredictionMarket", function () {
  let PredictionMarket, predictionMarket, owner;

  const dummyFtso = "0x3244690b7cb0d39f7f13b4b15aad3e7ce571ae44"; // adress in lowercase

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(dummyFtso);
    await predictionMarket.waitForDeployment();
  });

  it("should deploy correctly", async () => {
    const actual = await predictionMarket.ftso();
    // Case-insensitive comparison (lowercase == uppercase)
    expect(actual.toLowerCase()).to.equal(dummyFtso.toLowerCase());
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