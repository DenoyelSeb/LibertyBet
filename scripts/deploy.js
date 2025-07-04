const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract with account: ${deployer.address}`);

  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (chainId: ${network.chainId})`);

  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");

  // Replace with FTSO contract address on Coston2
  const ftsoAddress = "0x1000000000000000000000000000000000000001";

  const contract = await PredictionMarket.deploy(ftsoAddress);
  await contract.deployed();

  console.log(`Contract deployed to: ${contract.address}`);

  // Save to deployed.json
  const deploymentInfo = {
    contractName: "PredictionMarket",
    address: contract.address,
    network: network.name,
    chainId: network.chainId,
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