"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

export const SearchBar = ({ onSelect }: { onSelect: (assetId: string) => void }) => {
  const [query, setQuery] = useState("");
  const { prices } = useSocket();

  const availableAssets = Object.values(prices);
  
  const filtered = query.length > 0 
    ? availableAssets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.id.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative w-full max-w-md mx-auto z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[var(--color-pulse-blue)]" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-full leading-5 bg-[var(--color-glass)] placeholder-white/40 text-white focus:outline-none focus:border-[var(--color-pulse-blue)] focus:ring-1 focus:ring-[var(--color-pulse-blue)] sm:text-sm backdrop-blur-md transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] focus:shadow-[0_0_20px_rgba(99,91,255,0.3)]"
          placeholder="Search semantic node. e.g. BTC, Solana..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length > 0 && query.length > 0 && (
        <div className="absolute top-14 left-0 right-0 bg-navy/90 backdrop-blur-xl border border-[var(--color-pulse-blue)]/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(99,91,255,0.15)] divide-y divide-white/5">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              onClick={() => {
                onSelect(asset.id);
                setQuery("");
              }}
              className="w-full text-left px-4 py-3 hover:bg-[var(--color-pulse-blue)]/20 transition-colors flex justify-between items-center group"
            >
              <div className="flex flex-col">
                <span className="font-bold text-white group-hover:text-[var(--color-pulse-blue)] transition-colors">{asset.id}</span>
                <span className="text-xs text-white/50">{asset.name}</span>
              </div>
              <span className="text-sm font-mono">${asset.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
