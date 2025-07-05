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

  let yesProb = null;
  const yes = Number(yesPool);
  const no = Number(noPool);
  if (yes > 0 || no > 0) {
    yesProb = ((yes / (yes + no)) * 100).toFixed(1);
  } else {
    yesProb = "50";
  };

  return (
    <div style={styles.card}>
      <h3>{market.question}</h3>
      <p><strong>Category:</strong> {market.category}</p>
      {market.oracleId && <OraclePrices id={market.oracleId} />}
      {endTime && <p><strong>Resolution:</strong> {endTime}</p>}
      <p><strong>Pool YES:</strong> {yesPool} ETH</p>
      <p><strong>Pool NO:</strong> {noPool} ETH</p>
      <p>
        <strong>Market Probability:</strong>{" "}
        <span style={{ color: "#0b7" }}>
          YES {yesProb}% / NO {(100 - yesProb).toFixed(1)}%
        </span>
      </p>

      <div style={styles.buttonContainer}>
            <button
                onClick={() => placeBet(true)}
                disabled={loading}
                style={{
                ...styles.bigButton,
                background: "#22c55e",
                color: "white",
                opacity: loading ? 0.7 : 1,
                }}
            >
                ✅ YES
            </button>
            <button
                onClick={() => placeBet(false)}
                disabled={loading}
                style={{
                ...styles.bigButton,
                background: "#ef4444",
                color: "white",
                opacity: loading ? 0.7 : 1,
                }}
            >
                ❌ NO
            </button>
            <button
                onClick={withdraw}
                disabled={withdrawing}
                style={{
                ...styles.bigButton,
                background: "#6366f1",
                color: "white",
                opacity: withdrawing ? 0.7 : 1,
                }}
            >
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
  bigButton: {
  flex: 1,
  fontSize: 20,
  padding: "14px 0",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all .13s",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
},
};

export default MarketCard;
