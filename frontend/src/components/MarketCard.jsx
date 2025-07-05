import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import OraclePrices from "./OraclePrices";     // ← IMPORT
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractConfig";

export default function MarketCard({ market }) {
  const [yesPool, setYesPool] = useState(0);
  const [noPool, setNoPool] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const [yes, no] = await contract.getPools(market.id);
      setYesPool(ethers.formatEther(yes));
      setNoPool(ethers.formatEther(no));

      const md = await contract.markets(market.id);
      setEndTime(new Date(Number(md.endTime) * 1000).toLocaleString());
    } catch (e) {
      console.error("Error fetching pools:", e);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, []);

  const placeBet = async (yes) => { /*… inchangé…*/ };
  const withdraw = async () => { /*… inchangé…*/ };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-3">
      <h3 className="text-lg font-semibold">{market.question}</h3>
      <p className="text-sm text-gray-500">Category: {market.category}</p>

      {/* ORACLE PRICE, uniquement si on a un oracleId */}
      {market.oracleId && <OraclePrices id={market.oracleId} />}

      {/* DATE DE RÉSOLUTION */}
      {endTime && (
        <p className="text-sm text-gray-600">
          <strong>Resolution:</strong> {endTime}
        </p>
      )}

      <p><strong>Pool YES:</strong> {yesPool} ETH</p>
      <p><strong>Pool NO:</strong> {noPool} ETH</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => placeBet(true)}
          disabled={loading}
          className="px-5 py-2 bg-green-600 text-white rounded-lg text-base hover:bg-green-700"
        >
          ✅ YES
        </button>
        <button
          onClick={() => placeBet(false)}
          disabled={loading}
          className="px-5 py-2 bg-red-600 text-white rounded-lg text-base hover:bg-red-700"
        >
          ❌ NO
        </button>
        <button
          onClick={withdraw}
          disabled={withdrawing}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700"
        >
          💸 Withdraw
        </button>
      </div>

      {loading && <p>⏳ Placing bet...</p>}
      {withdrawing && <p>💸 Withdrawing...</p>}
      {txHash && (
        <p className="text-sm text-gray-700">
          ✅ Tx:{" "}
          <a
            href={`https://coston2-explorer.flare.network/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-600"
          >
            {txHash.slice(0, 10)}…
          </a>
        </p>
      )}
      {error && <p className="text-sm text-red-500">⚠ {error}</p>}
    </div>
  );
}