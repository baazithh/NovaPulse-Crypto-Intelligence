"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export type AssetStatus = "Surging Now" | "Crashing Now" | "Stable";

export interface CryptoData {
  id: string;
  name: string;
  price: number;
  timestamp: number;
  status: AssetStatus;
  change24h: number;
}

export interface MLPrediction {
  id: string;
  asset: string;
  type: "RISE soon" | "CRASH soon";
  reason: string;
  probability: number;
  timestamp: number;
  priceAtSignal: number;
}

interface SocketContextData {
  socket: Socket | null;
  prices: Record<string, CryptoData>;
  predictions: MLPrediction[];
}

const SocketContext = createContext<SocketContextData>({
  socket: null,
  prices: {},
  predictions: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [prices, setPrices] = useState<Record<string, CryptoData>>({});
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000", { path: "/ws/socket.io" });
    setSocket(newSocket);

    newSocket.on("price_update", (data: CryptoData[]) => {
      setPrices((prev) => {
        const next = { ...prev };
        data.forEach((item) => {
          next[item.id] = item;
        });
        return next;
      });
    });

    newSocket.on("ml_prediction", (data: MLPrediction) => {
      setPredictions((prev) => {
        const next = [data, ...prev];
        return next.slice(0, 50); // Keep last 50 alerts
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, prices, predictions }}>
      {children}
    </SocketContext.Provider>
  );
};
