"use client";

import React from "react";
import { useSocket } from "@/context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react";

export const AlertFeed = () => {
  const { predictions } = useSocket();

  return (
    <div className="glass-panel p-4 h-[400px] flex flex-col hide-scrollbar overflow-hidden">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <AlertTriangle size={20} className="text-[var(--color-pulse-blue)]"/>
        <h2 className="text-xl font-bold font-mono text-[var(--color-pulse-blue)] tracking-wide uppercase">Oracle Neural Feed</h2>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 space-y-3 pb-4">
        <AnimatePresence>
          {predictions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 italic text-sm text-center mt-10">
              Awaiting predictive signals...
            </motion.div>
          ) : (
            predictions.map((pred) => {
              const isRise = pred.type === "RISE soon";
              const colorClass = isRise ? "text-[var(--color-mint)] border-[var(--color-mint)]" : "text-[var(--color-neon-red)] border-[var(--color-neon-red)]";
              const bgGlow = isRise ? "bg-[var(--color-mint)]/10" : "bg-[var(--color-neon-red)]/10";
              const Icon = isRise ? TrendingUp : TrendingDown;

              return (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`border-l-2 pl-3 py-2 ${colorClass} ${bgGlow} rounded-r-md flex flex-col gap-1`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold flex items-center gap-2">
                      <Icon size={16} />
                      {pred.asset} {pred.type}
                    </span>
                    <span className="text-xs font-mono opacity-80">
                      {(pred.probability * 100).toFixed(1)}% prob
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-white/80 gap-1 mt-1">
                    <Info size={12} className="opacity-60"/> {pred.reason}
                  </div>
                  <div className="text-[10px] font-mono opacity-50 mt-1">
                    @ ${pred.priceAtSignal.toFixed(2)} - {new Date(pred.timestamp).toLocaleTimeString()}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
