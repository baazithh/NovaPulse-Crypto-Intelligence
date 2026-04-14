"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PriceCard } from "@/components/PriceCard";
import { AlertFeed } from "@/components/AlertFeed";
import { CryptoChart } from "@/components/CryptoChart";
import { useSocket } from "@/context/SocketContext";
import { Activity } from "lucide-react";

export default function Home() {
  const { prices } = useSocket();
  const [selectedAsset, setSelectedAsset] = useState<string>("BTC");

  const assets = Object.values(prices);

  return (
    <main className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto flex flex-col gap-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-pulse-blue)]/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--color-mint)]/10 blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-pulse-blue)]/20 to-transparent opacity-50"></div>
             <Activity className="w-8 h-8 text-[var(--color-mint)] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              NovaPulse
            </h1>
            <p className="text-sm font-mono text-[var(--color-pulse-blue)] tracking-[0.2em] uppercase mt-1">
              Crypto Intelligence
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex-1 max-w-lg">
          <SearchBar onSelect={(id) => setSelectedAsset(id)} />
        </div>
      </header>

      {/* Real-time Crypto Prices Strip */}
      <div className="w-full relative z-10 overflow-hidden hide-scrollbar">
        {assets.length === 0 ? (
          <div className="flex gap-4 opacity-50 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[240px] h-[100px] bg-white/5 border border-white/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
             {assets.map((asset) => (
               <div key={asset.id} className="min-w-[280px] sm:min-w-[300px] cursor-pointer snap-start" onClick={() => setSelectedAsset(asset.id)}>
                 <PriceCard asset={asset} />
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 flex-1 min-h-[500px]">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          {selectedAsset && <CryptoChart assetId={selectedAsset} />}
        </div>
        
        {/* ML Feed Area */}
        <div className="flex flex-col h-full">
          <AlertFeed />
        </div>
      </div>
    </main>
  );
}
