import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractConfig";
import OraclePrices from "./OraclePrices";

const MarketCard = ({ market, price }) => {
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

      const marketData = await contract.markets(market.id);
      setEndTime(new Date(Number(marketData.endTime) * 1000).toLocaleString());
    } catch (e) {
      console.error("Error fetching pools:", e);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000); // Refresh every 15 sec
    return () => clearInterval(interval);
  }, []);

  const placeBet = async (yes) => {
    console.log("Bouton", yes ? "YES" : "NO", "cliqué pour market id", market.id);
    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const value = ethers.parseEther("0.01");

      const tx = yes
        ? await contract.betYes(market.id, { value })
        : await contract.betNo(market.id, { value });

      await tx.wait();
      setTxHash(tx.hash);
      await refreshData();
    } catch (e) {
      console.error(e);
      setError(e.message || "Bet failed");
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    console.log("Bouton withdraw cliqué pour market id", market.id);
    try {
      setWithdrawing(true);
      setError(null);
      setTxHash(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.claim(market.id);
      await tx.wait();

      setTxHash(tx.hash);
    } catch (e) {
      console.error(e);
      setError(e.message || "Withdraw failed");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div style={styles.card}>
        <h3>{market.question}</h3>
        <p><strong>Category:</strong> {market.category}</p>
        {market.oracleId && <OraclePrices id={market.oracleId} />}
        {endTime && <p><strong>Resolution:</strong> {endTime}</p>}
        <p><strong>Pool YES:</strong> {yesPool} ETH</p>
        <p><strong>Pool NO:</strong> {noPool} ETH</p>

      <div style={styles.buttonContainer}>
        <button onClick={() => placeBet(true)} disabled={loading}>
          ✅ YES
        </button>
        <button onClick={() => placeBet(false)} disabled={loading}>
          ❌ NO
        </button>
        <button onClick={withdraw} disabled={withdrawing}>
          💸 Withdraw
        </button>
      </div>

      {loading && <p>⏳ Placing bet...</p>}
      {withdrawing && <p>💸 Withdrawing...</p>}
      {txHash && (
        <p>
          ✅ Tx:{" "}
          <a
            href={`https://coston2-explorer.flare.network/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 10)}...
          </a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>⚠ {error}</p>}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  },
};

export default MarketCard;