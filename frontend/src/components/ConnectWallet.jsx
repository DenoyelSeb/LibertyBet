import React, { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({ onConnect }) {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      onConnect && onConnect(signer);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {address ? (
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          ✅ {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}