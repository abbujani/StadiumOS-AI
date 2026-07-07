"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { calculateCarbonSavings } from "@/utils/transit";
import { 
  Train, 
  Bus, 
  Clock, 
  Calculator,
  Compass
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

export default function TransportationPage() {
  const { transitFeeds } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [distanceKm, setDistanceKm] = useState(15);
  const [selectedTransit, setSelectedTransit] = useState("metro");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Simulated traffic perimeter speeds (mph) over time
  const trafficSpeedData = useMemo(() => [
    { time: "18:00", freewaySpeed: 55, stadiumRoadsSpeed: 38 },
    { time: "18:30", freewaySpeed: 48, stadiumRoadsSpeed: 28 },
    { time: "19:00", freewaySpeed: 42, stadiumRoadsSpeed: 18 },
    { time: "19:30", freewaySpeed: 30, stadiumRoadsSpeed: 12 },
    { time: "20:00", freewaySpeed: 25, stadiumRoadsSpeed: 8 },
    { time: "20:30", freewaySpeed: 45, stadiumRoadsSpeed: 32 },
    { time: "21:00", freewaySpeed: 58, stadiumRoadsSpeed: 40 },
  ], []);

  const { soloCarCarbon, selectedCarbon, carbonSaved } = useMemo(
    () => calculateCarbonSavings(distanceKm, selectedTransit),
    [distanceKm, selectedTransit]
  );

  // Transit forecast data (+10, +20, +30 mins)
  const transitForecasts = useMemo(() => [
    { time: "+10 mins", mode: "Metro Line 26", status: "on-time", wait: "4 min wait", load: "heavy" },
    { time: "+10 mins", mode: "Stadium Shuttle", status: "on-time", wait: "6 min wait", load: "medium" },
    { time: "+20 mins", mode: "Metro Line 26", status: "busy", wait: "6 min wait", load: "heavy" },
    { time: "+20 mins", mode: "Stadium Shuttle", status: "delayed", wait: "12 min wait", load: "heavy" },
    { time: "+30 mins", mode: "Metro Line 26", status: "delayed", wait: "10 min wait", load: "critical" }, // post-match peak
    { time: "+30 mins", mode: "Stadium Shuttle", status: "slow", wait: "15 min wait", load: "heavy" }
  ], []);

  if (!isMounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Train className="w-6 h-6 text-purple-400" />
          Tournament Transportation Hub
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Live bus/shuttle schedules, peripheral traffic congestion curves, and green transit carbon estimators</p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Transit monitors & predictions */}
        <div className="xl:col-span-1 space-y-6">
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center justify-between">
              <span>Transit Route Monitors</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Continuous feeds</span>
            </h3>

            <div className="space-y-3">
              {transitFeeds.map((feed) => (
                <div key={feed.id} className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">
                        {feed.type === "metro" ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                      </span>
                      <span className="text-xs font-bold text-white">{feed.line}</span>
                    </div>
                    
                    <Badge variant={feed.status === "on-time" ? "success" : "warning"}>
                      {feed.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Next in {feed.etaMinutes} mins
                    </span>
                    <span className="capitalize">Load: {feed.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Predictive Transit Delays */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1">
              <Compass className="w-4.5 h-4.5 text-purple-400" />
              AI Transit Delay Forecast
            </h3>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Estimated traffic delays and boarding congestion curves forecasted in 10, 20, and 30-minute intervals.
            </p>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {transitForecasts.map((f, idx) => (
                <div key={idx} className="p-2.5 bg-white/2.5 border border-white/5 rounded text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold block">{f.time} • {f.mode}</span>
                    <span className="text-[11px] text-gray-300">Wait: {f.wait}</span>
                  </div>
                  <Badge variant={f.status === "delayed" || f.status === "slow" ? "error" : f.status === "busy" ? "warning" : "success"}>
                    {f.load} load
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right side: Traffic graphs + Carbon footprint calculator */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Traffic speeds timeline */}
          <GlassCard className="p-5">
            <h3 className="font-bold text-sm text-white mb-4">Perimeter Traffic Speed Curve (mph)</h3>
            <div className="h-52 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficSpeedData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Legend />
                  <Line type="monotone" dataKey="stadiumRoadsSpeed" name="Stadium Access Roads" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="freewaySpeed" name="Surrounding Freeways" stroke="#3b82f6" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Carbon footprint calculator */}
          <GlassCard className="p-5 space-y-4" glow>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Calculator className="w-4.5 h-4.5 text-purple-400" />
                Transit Carbon Calculator
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Compare ecological footprints across transit channels</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Commute Distance:</span>
                  <span className="text-white font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Compare Option</label>
                <select
                  value={selectedTransit}
                  onChange={(e) => setSelectedTransit(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="metro">Metro Rail Line (Clean)</option>
                  <option value="bus">Shuttle Bus (Low Carbon)</option>
                  <option value="rideshare">Ride-Share (Carpool)</option>
                </select>
              </div>

              {/* Calculator Output */}
              <div className="p-3.5 bg-emerald-500/10 rounded-lg border border-emerald-500/25 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Carbon Savings</span>
                <span className="text-xl font-black text-emerald-300 mt-1">-{carbonSaved.toFixed(0)}g CO2</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">compared to driving solo</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
