"use client";

import React, { useState, useEffect } from "react";
import { Users, Leaf, ShieldCheck } from "lucide-react";
import GlassCard from "./GlassCard";

export default function LiveMetrics() {
  const [attendeeCount, setAttendeeCount] = useState(62840);
  const [carbonOffset, setCarbonOffset] = useState(1420.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttendeeCount((prev) => {
        if (prev >= 69850) return 62840;
        return prev + Math.floor(Math.random() * 8) + 1;
      });
      setCarbonOffset((prev) => prev + 0.1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <GlassCard className="p-5 flex items-center justify-between" glow hoverGlow>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Active Attendance</span>
          <h3 className="text-2xl font-black text-white">{attendeeCount.toLocaleString()}</h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SoFi Stadium (Los Angeles)
          </p>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
          <Users className="w-6 h-6" />
        </div>
      </GlassCard>

      <GlassCard className="p-5 flex items-center justify-between" glow hoverGlow>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Carbon Footprint Saved</span>
          <h3 className="text-2xl font-black text-emerald-400">-{carbonOffset.toFixed(1)} kg</h3>
          <p className="text-[10px] text-muted-foreground">High public transit adoption rate</p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Leaf className="w-6 h-6" />
        </div>
      </GlassCard>

      <GlassCard className="p-5 flex items-center justify-between" glow hoverGlow>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Security dispatch status</span>
          <h3 className="text-2xl font-black text-white">System Nominal</h3>
          <p className="text-[10px] text-muted-foreground">Continuous camera telemetry</p>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </GlassCard>
    </div>
  );
}
