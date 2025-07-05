import React, { useEffect, useState } from "react";
import MarketCard from "./MarketCard";
import { ethers } from "ethers";
import PredictionMarketArtifact from "../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json";
import { CONTRACT_ADDRESS } from "../contractConfig";

const mockMarketData = [
  { id: 0, question: "ETH/USD above 3500 by August 10", category: "global", oracleId: "ethereum" },
  { id: 1, question: "Tadej Pogacar wins Tour de France 2025", category: "global" },
  { id: 2, question: "US recession in 2025", category: "global" },
  { id: 3, question: "USDT/GEL drop below 2.7 before October 1st", category: "local", oracleId: "georgian-lari" },
  { id: 4, question: "Weather in Batumi over 40° in July", category: "local" },
  { id: 5, question: "Georgian Dream wins the next election", category: "local" },
];

export default function MarketList({ category }) {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const loadMarkets = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PredictionMarketArtifact.abi,
        provider
      );

      const updatedMarkets = await Promise.all(
        mockMarketData.map(async (market, id) => {
          try {
            const [yes, no] = await contract.getPools(id)
            return {
              ...market,
              yesPool: parseFloat(ethers.formatEther(yes)),
              noPool: parseFloat(ethers.formatEther(no)),
            };
          } catch (err) {
            console.warn(`Erreur marché ${market.id}:`, err);
            return { ...market, yesPool: 0, noPool: 0 };
          }
        })
      );

      setMarkets(updatedMarkets);
    };

    loadMarkets();
  }, []);

  const filteredMarkets = markets.filter((m) => m.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredMarkets.map((m) => (
        <MarketCard key={m.id} market={m} />
      ))}
    </div>
  );
}