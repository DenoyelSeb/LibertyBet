const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contract with account: ${await deployer.getAddress()}`);

  const network = await hre.ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (chainId: ${network.chainId})`);

  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");

  // Adresse Chainlink ETH/USD pour Sepolia
  // https://docs.chain.link/data-feeds/price-feeds/addresses/?network=sepolia
  const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

  const contract = await PredictionMarket.deploy(priceFeedAddress);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`Contract deployed to: ${address}`);

  // Save to deployed.json
  const deploymentInfo = {
    contractName: "PredictionMarket",
    address,
    network: network.name,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filepath = path.join(deploymentsDir, "deployed.json");
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment saved to ${filepath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
