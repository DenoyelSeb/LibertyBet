const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  // Update with your deployed contract address:
  const contractAddress = "0x1cD544308FCDCC9510bdCC7A680ED10fD947E08b";
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const contract = PredictionMarket.attach(contractAddress);

  // Helper for pretty logging
  function days(num) { return 60 * 60 * 24 * num; }

  // Market list — with question, targetPrice (int256), and duration (in seconds)
  const markets = [
    {
      question: "ETH/USD above 3500 by August 10",
      targetPrice: 3500 * 1e8, // 8 decimals (Chainlink price feeds standard)
      duration: Math.floor((new Date("2025-08-10T23:59:59Z").getTime() / 1000) - Math.floor(Date.now() / 1000)),
    },
    {
      question: "Tadej Pogacar wins Tour de France 2025",
      targetPrice: 0, // No target
      duration: days(20),
    },
    {
      question: "US recession in 2025",
      targetPrice: 0, // No target
      duration: Math.floor((new Date("2025-12-31T23:59:59Z").getTime() / 1000) - Math.floor(Date.now() / 1000)),
    },
    {
      question: "USDT/GEL drop below 2.7 before October 1st",
      targetPrice: 2.7 * 1e8, // if you want to compare on-chain price
      duration: Math.floor((new Date("2025-10-01T00:00:00Z").getTime() / 1000) - Math.floor(Date.now() / 1000)),
    },
    {
      question: "Weather in Batumi over 40° in July",
      targetPrice: 0, // No target
      duration: Math.floor((new Date("2025-08-01T00:00:00Z").getTime() / 1000) - Math.floor(Date.now() / 1000)),
    },
    {
      question: "Georgian Dream wins the next election",
      targetPrice: 0, // No target
      duration: Math.floor((new Date("2025-10-04T00:00:00Z").getTime() / 1000) - Math.floor(Date.now() / 1000)),
    }
  ];

  // Creation loop
  for (let i = 0; i < markets.length; i++) {
    const m = markets[i];
    const tx = await contract.createMarket(m.question, m.targetPrice, m.duration);
    await tx.wait();
    console.log(`Market #${i} created: "${m.question}" (target: ${m.targetPrice}, ${m.duration} seconds until close)`);
  }

  console.log("All markets created successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});