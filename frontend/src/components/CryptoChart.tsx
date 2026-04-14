"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from "lightweight-charts";
import { useSocket } from "@/context/SocketContext";

export const CryptoChart = ({ assetId }: { assetId: string }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  
  const { prices, predictions } = useSocket();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#635BFF',
      topColor: 'rgba(99, 91, 255, 0.4)',
      bottomColor: 'rgba(99, 91, 255, 0.0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart when prices change
  useEffect(() => {
    const assetData = prices[assetId];
    if (assetData && seriesRef.current) {
      const time = (assetData.timestamp / 1000) as Time;
      try {
        seriesRef.current.update({
          time,
          value: assetData.price,
        });
        if (!dataLoaded) setDataLoaded(true);
      } catch (e) {
        // ignoring duplicate time errors initially
      }
    }
  }, [prices, assetId, dataLoaded]);

  // Handle markers (predictions)
  useEffect(() => {
    if (!seriesRef.current || predictions.length === 0) return;

    const markers = predictions
      .filter((p) => p.asset === assetId)
      .map((p) => {
        const isRise = p.type === "RISE soon";
        return {
          time: (p.timestamp / 1000) as Time,
          position: (isRise ? 'belowBar' : 'aboveBar') as any,
          color: isRise ? '#00FFC2' : '#FF3131',
          shape: (isRise ? 'arrowUp' : 'arrowDown') as any,
          text: p.reason,
        };
      })
      .sort((a, b) => (a.time as number) - (b.time as number));

    if (markers.length > 0) {
      seriesRef.current.setMarkers(markers);
    }
  }, [predictions, assetId]);

  return (
    <div className="glass-panel p-4 flex flex-col pt-6 relative h-full">
      <div className="absolute top-4 left-6 z-10 flex items-center gap-4">
         <h3 className="text-2xl font-bold font-mono tracking-wider">{assetId}/USD</h3>
         <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50 border border-white/10 uppercase tracking-widest">
           Live Feed
         </div>
      </div>
      {!dataLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm italic z-0 animate-pulse">
          Establishing link to quantum node...
        </div>
      )}
      <div ref={chartContainerRef} className="w-full flex-1 relative z-10 mt-10" />
    </div>
  );
};
