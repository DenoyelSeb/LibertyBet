import React from "react";
import "./App.css";
import ConnectWallet from "./components/ConnectWallet";
import MarketList from "./components/MarketList";
import OraclePrices from "./components/OraclePrices";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-md p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow">🧠 LibertyBet</h1>
          <ConnectWallet />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center min-h-[80vh] py-10 px-2">
        <div className="w-full max-w-6xl grid border border-red-600 grid-cols-2 gap-10">
          {/* Global Markets */}
          <section className="market-column flex-1 mb-10 lg:mb-0">
            <div className="category-header mb-4"><span>🌍</span>Global Markets</div>
            <MarketList category="global" />
          </section>
          {/* Local Markets */}
          <section className="market-column flex-1">
            <div className="category-header mb-4"><span>🇬🇪</span>Local Markets</div>
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
