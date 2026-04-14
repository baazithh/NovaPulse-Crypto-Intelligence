"use client";

import React from "react";
import { CryptoData } from "@/context/SocketContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export const PriceCard = ({ asset }: { asset: CryptoData }) => {
  const isSurging = asset.status === "Surging Now";
  const isCrashing = asset.status === "Crashing Now";
  
  let borderColor = "border-white/10";
  let statusColor = "text-gray-400";
  let glowColor = "";

  if (isSurging) {
    borderColor = "border-[var(--color-mint)]";
    statusColor = "text-[var(--color-mint)]";
    glowColor = "shadow-[0_0_15px_rgba(0,255,194,0.3)]";
  } else if (isCrashing) {
    borderColor = "border-[var(--color-neon-red)]";
    statusColor = "text-[var(--color-neon-red)]";
    glowColor = "shadow-[0_0_15px_rgba(255,49,49,0.3)]";
  }

  return (
    <motion.div 
      key={asset.price} // trigger subtle jump on price change
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-panel p-4 flex flex-col gap-2 transition-all duration-300 ${borderColor} ${glowColor}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-white">{asset.id}</span>
        <span className="text-sm text-gray-400">{asset.name}</span>
      </div>
      
      <div className="text-2xl font-mono tracking-tight text-white flex items-center justify-between">
        ${asset.price.toFixed(2)}
        <span className={`text-sm flex items-center self-end mb-1 ${asset.change24h >= 0 ? "text-[var(--color-mint)]" : "text-[var(--color-neon-red)]"}`}>
          {asset.change24h >= 0 ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
          {Math.abs(asset.change24h).toFixed(2)}%
        </span>
      </div>

      <div className={`text-xs uppercase tracking-widest font-semibold flex items-center mt-2 ${statusColor}`}>
        {isSurging && <div className="w-2 h-2 rounded-full bg-[var(--color-mint)] mr-2 animate-pulse-glow" />}
        {isCrashing && <div className="w-2 h-2 rounded-full bg-[var(--color-neon-red)] mr-2 animate-pulse-glow" />}
        {!isSurging && !isCrashing && <Minus size={14} className="mr-2 opacity-50" />}
        {asset.status}
      </div>
    </motion.div>
  );
};
