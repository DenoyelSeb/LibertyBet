import React from "react";
import "./App.css";
import ConnectWallet from "./components/ConnectWallet";
import MarketList from "./components/MarketList";
import OraclePrices from "./components/OraclePrices";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">🧠 LibertyBet</h1>
        <ConnectWallet />
      </header>

      {/* Main */}
      <main className="p-6 max-w-screen-lg mx-auto scale-105">

        {/* Markets (split horizontally) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Global Markets */}
          <section className="bg-white rounded-lg shadow p-4 w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <h2 className="text-xl font-semibold">Global Markets</h2>
            </div>
            <MarketList category="global" />
          </section>

          {/* Local Markets */}
          <section className="bg-white rounded-lg shadow p-4 w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇬🇪</span>
              <h2 className="text-xl font-semibold">Local Markets</h2>
            </div>
            <MarketList category="local" />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        Built with ❤️ for ETHGlobal — LibertyBet v1
      </footer>
    </div>
  );
}

export default App;
