import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import PredictionMarketArtifact from "../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json";
import { CONTRACT_ADDRESS } from "../contractConfig";

// id ex: "ethereum", "gel-usdt", "georgian-lari"
export default function OraclePrices({ id }) {
  const [price, setPrice] = useState(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // ETH/USD from on-chain oracle
        if (id === "ethereum") {
          if (!window.ethereum) return;
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PredictionMarketArtifact.abi,
            provider
          );
          const result = await contract.getEthUsd();
          const formatted = parseFloat(ethers.formatUnits(result, 8));
          setPrice(`$${formatted}`);
          setSource("Chainlink Oracle (on-chain)");
        }
        // GEL/USDT from CoinGecko
        else if (id === "georgian-lari") {
          // CoinGecko: https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=gel
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=gel"
          );
          const data = await response.json();
          if (data.tether?.gel) {
            setPrice(`${data.tether.gel} GEL`);
            setSource("CoinGecko (off-chain, GEL/USDT)");
          } else {
            setPrice("N/A");
            setSource("CoinGecko error");
          }
        }
        // Add fallback for other supported ids if needed
        else if (id) {
          // Generic: fetch price in USD
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
          );
          const data = await response.json();
          if (data[id]?.usd) {
            setPrice(`$${data[id].usd}`);
            setSource("CoinGecko (off-chain)");
          } else {
            setPrice("N/A");
            setSource("CoinGecko error");
          }
        }
      } catch (err) {
        setPrice("Error");
        setSource("Fetch failed");
        console.error("Oracle fetch error:", err); 
      }
    };

    fetchPrice();
  }, [id]);

  if (!price) return null;

  return (
    <div className="text-sm text-gray-600 mt-2">
      <span className="font-medium">Oracle Price:</span> {price}{" "}
      <span className="italic text-gray-400">({source})</span>
    </div>
  );
}
