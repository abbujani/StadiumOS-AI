"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  TrendingDown, 
  Activity, 
  Layers
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from "recharts";

export default function CrowdAnalyticsPage() {
  const { gateStatuses } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Seating capacity fill timeline
  const occupancyTimeline = useMemo(() => [
    { time: "18:00", fans: 8000, capacity: 70000 },
    { time: "18:30", fans: 18000, capacity: 70000 },
    { time: "19:00", fans: 32000, capacity: 70000 },
    { time: "19:30", fans: 48000, capacity: 70000 },
    { time: "20:00", fans: 64000, capacity: 70000 },
    { time: "20:30", fans: 68401, capacity: 70000 },
    { time: "21:00", fans: 68900, capacity: 70000 },
    { time: "21:30", fans: 69200, capacity: 70000 },
  ], []);

  // Predictive Queue length (minutes) over time
  const queueForecast = useMemo(() => [
    { time: "22:00", GateA: gateStatuses["Gate A (North)"] === "congested" ? 28 : 12, GateB: 6, GateC: 4, GateD: 8 },
    { time: "22:30", GateA: gateStatuses["Gate A (North)"] === "congested" ? 18 : 6, GateB: 12, GateC: 8, GateD: 4 },
    { time: "23:00", GateA: 4, GateB: 4, GateC: 2, GateD: 2 }, // Match underway - low queue
    { time: "23:30", GateA: 15, GateB: 24, GateC: 18, GateD: 10 }, // Post-match egress peaks
    { time: "00:00", GateA: 2, GateB: 4, GateC: 4, GateD: 2 },
  ], [gateStatuses]);

  // Gate efficiency metrics
  const gateMetrics = useMemo(() => [
    { name: "Gate A (North)", checkins: 22400, share: "32%", status: gateStatuses["Gate A (North)"], wait: gateStatuses["Gate A (North)"] === "congested" ? "28 min" : "12 min" },
    { name: "Gate B (East)", checkins: 16800, share: "24%", status: gateStatuses["Gate B (East)"], wait: gateStatuses["Gate B (East)"] === "congested" ? "22 min" : "6 min" },
    { name: "Gate C (South)", checkins: 12600, share: "18%", status: gateStatuses["Gate C (South)"], wait: "4 min" },
    { name: "Gate D (West)", checkins: 14700, share: "21%", status: gateStatuses["Gate D (West)"], wait: "8 min" },
    { name: "ADA Gate 1", checkins: 1901, share: "3%", status: gateStatuses["ADA Gate 1"], wait: "2 min" },
  ], [gateStatuses]);

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
          <Users className="w-6 h-6 text-purple-400" />
          Crowd Intelligence Dashboard
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time crowd distribution, queue prediction schedules, and gates flow optimization</p>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Average Intake Rate</span>
            <h3 className="text-xl font-black text-white mt-1">340 fans/min</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12% vs last match
            </span>
          </div>
          <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Concourse Load Index</span>
            <h3 className="text-xl font-black text-white mt-1">Medium Load (0.64)</h3>
            <span className="text-[10px] text-muted-foreground">Optimal density in walking areas</span>
          </div>
          <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Intake Wait Bottleneck</span>
            <h3 className="text-xl font-black text-white mt-1">Gate A (28m max)</h3>
            <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> Slow flow detected
            </span>
          </div>
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
            <Clock className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Occupancy Timeline */}
        <GlassCard className="p-5" glow>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Capacity Load Timeline</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Fans entrance load curves compared to max seating cap</p>
            </div>
            <Badge variant="purple">Live Data</Badge>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                <Area type="monotone" dataKey="fans" name="Active Spectators" stroke="#a855f7" fillOpacity={1} fill="url(#colorFans)" strokeWidth={2} />
                <Area type="monotone" dataKey="capacity" name="Total Capacity (70k)" stroke="rgba(255,255,255,0.2)" fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Queue Wait Time predictions */}
        <GlassCard className="p-5" glow>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Queue Time Predictions (min)</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Next 2 hours queue timelines by gate based on ingress flow</p>
            </div>
            <Badge variant="info">AI Forecast</Badge>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={queueForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                <Legend />
                <Line type="monotone" dataKey="GateA" name="Gate A (North)" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="GateB" name="Gate B (East)" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="GateC" name="Gate C (South)" stroke="#10b981" strokeWidth={1.5} />
                <Line type="monotone" dataKey="GateD" name="Gate D (West)" stroke="#f59e0b" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Gate flow share metrics */}
      <GlassCard className="p-5 mt-6">
        <h3 className="font-bold text-sm text-white mb-4">Gate Flow Share & Wait Times</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-muted-foreground">
                <th className="pb-2">Gate Location</th>
                <th className="pb-2">Total Check-Ins</th>
                <th className="pb-2">Percentage Share</th>
                <th className="pb-2">Intake Status</th>
                <th className="pb-2">Average Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {gateMetrics.map((gate, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/2.5 transition">
                  <td className="py-3 font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {gate.name}
                  </td>
                  <td className="py-3 text-gray-300">{gate.checkins.toLocaleString()}</td>
                  <td className="py-3 text-gray-300">{gate.share}</td>
                  <td className="py-3">
                    <Badge variant={gate.status === "closed" ? "error" : gate.status === "congested" ? "warning" : "success"}>
                      {gate.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-white font-bold">{gate.wait}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
}
