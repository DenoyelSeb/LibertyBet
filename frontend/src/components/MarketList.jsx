import React, { useEffect, useState } from "react";
import MarketCard from "./MarketCard";
import { ethers } from "ethers";
import PredictionMarketArtifact from "../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json";
import { CONTRACT_ADDRESS } from "../contractConfig";

// You can map the index to your metadata (category, oracleId) if not on-chain!
const metaData = [
  { category: "global", oracleId: "ethereum" },
  { category: "global" },
  { category: "global" },
  { category: "local", oracleId: "georgian-lari" },
  { category: "local" },
  { category: "local" },
];

export default function MarketList({ category }) {
  const [markets, setMarkets] = useState(null);

  useEffect(() => {
    const loadMarkets = async () => {
      console.log("Start loading markets...");
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketArtifact.abi, provider);

      // Get market count
      const marketCount = Number(await contract.marketCount());
      console.log("Market count from contract:", marketCount);

      const arr = [];
      for (let i = 0; i < marketCount; i++) {
        try {
          const m = await contract.markets(i);
          // m = ResultProxy, destructure needed fields
          arr.push({
            id: i,
            question: m[0],
            targetPrice: m[1],
            endTime: Number(m[2]),
            yesPool: m[3],
            noPool: m[4],
            resolved: m[5],
            outcome: m[6],
            ...metaData[i], // attach metadata for category/oracleId
          });
          console.log(`Market #${i}:`, m);
        } catch (e) {
          console.warn(`Failed to load market #${i}`, e);
        }
      }
      setMarkets(arr);
      console.log("Loaded markets array:", arr);
    };
    loadMarkets();
  }, []);

  if (!markets) {
    return <div>Loading markets...</div>;
  }

  // Filter by category, fallback if missing metaData
  const filteredMarkets = markets.filter((m) => m.category === category);

  if (filteredMarkets.length === 0) return <div>No markets found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredMarkets.map((m) => (
        <MarketCard key={m.id} market={m} />
      ))}
    </div>
  );
}
