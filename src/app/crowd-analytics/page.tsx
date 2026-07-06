"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  HelpCircle,
  Sparkles,
  ArrowRight,
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from "recharts";

export default function CrowdAnalyticsPage() {
  const { gateStatuses } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Seating capacity fill timeline
  const occupancyTimeline = [
    { time: "18:00", fans: 8000, capacity: 70000 },
    { time: "18:30", fans: 18000, capacity: 70000 },
    { time: "19:00", fans: 32000, capacity: 70000 },
    { time: "19:30", fans: 48000, capacity: 70000 },
    { time: "20:00", fans: 64000, capacity: 70000 },
    { time: "20:30", fans: 68401, capacity: 70000 },
    { time: "21:00", fans: 68900, capacity: 70000 },
    { time: "21:30", fans: 69200, capacity: 70000 },
  ];

  // Predictive Queue length (minutes) over time
  const queueForecast = [
    { time: "22:00", GateA: gateStatuses["Gate A (North)"] === "congested" ? 28 : 12, GateB: 6, GateC: 4, GateD: 8 },
    { time: "22:30", GateA: gateStatuses["Gate A (North)"] === "congested" ? 18 : 6, GateB: 12, GateC: 8, GateD: 4 },
    { time: "23:00", GateA: 4, GateB: 4, GateC: 2, GateD: 2 }, // Match underway - low queue
    { time: "23:30", GateA: 15, GateB: 24, GateC: 18, GateD: 10 }, // Post-match egress peaks
    { time: "00:00", GateA: 2, GateB: 4, GateC: 4, GateD: 2 },
  ];

  // Gate efficiency metrics
  const gateMetrics = [
    { name: "Gate A (North)", checkins: 22400, share: "32%", status: gateStatuses["Gate A (North)"], wait: gateStatuses["Gate A (North)"] === "congested" ? "28 min" : "12 min" },
    { name: "Gate B (East)", checkins: 16800, share: "24%", status: gateStatuses["Gate B (East)"], wait: gateStatuses["Gate B (East)"] === "congested" ? "22 min" : "6 min" },
    { name: "Gate C (South)", checkins: 12600, share: "18%", status: gateStatuses["Gate C (South)"], wait: "4 min" },
    { name: "Gate D (West)", checkins: 14700, share: "21%", status: gateStatuses["Gate D (West)"], wait: "8 min" },
    { name: "ADA Gate 1", checkins: 1901, share: "3%", status: gateStatuses["ADA Gate 1"], wait: "2 min" },
  ];

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
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Avg Ticket Processing Time</span>
            <h3 className="text-xl font-black text-white mt-1">1.8 seconds</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -0.4s (NFC scanners online)
            </span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* Area & Bar Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Occupancy fill Timeline */}
        <GlassCard className="p-5">
          <h3 className="font-bold text-sm text-white mb-4">Seating Bowl Occupancy Fill Curve</h3>
          <div className="h-56 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorFans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                <Area type="monotone" dataKey="fans" name="Attendees inside" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorFans)" />
                <Area type="monotone" dataKey="capacity" name="Stadium Capacity" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Predictive wait curves */}
        <GlassCard className="p-5">
          <h3 className="font-bold text-sm text-white mb-4">Predictive Queue Length (2-Hour Egress Outlook)</h3>
          <div className="h-56 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queueForecast} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                <Legend />
                <Bar dataKey="GateA" name="Gate A wait" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="GateB" name="Gate B wait" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="GateD" name="Gate D wait" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Alternate Gate Recommendations and Gate Throughputs details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alternate gate recommendation (AI Card) */}
        <GlassCard className="p-5 lg:col-span-1 flex flex-col justify-between" glow>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Congestion Balancer
            </h3>
            
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-xs text-gray-200 space-y-2">
                <p className="font-bold text-purple-300">Intake Balancing Action Advised:</p>
                <p className="leading-relaxed">
                  Gate A is experiencing high density. AI models predict turnstile queue clearance will reach 32 minutes unless balanced.
                </p>
                <p className="leading-relaxed font-semibold text-white">
                  Action: Redirect incoming parking zone traffic from Lots 1 & 2 to Gate D (West Stand).
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Target Outcomes:</span>
                <div className="flex gap-2 text-xs items-center text-gray-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Reduce Gate A peak queues by 35%</span>
                </div>
                <div className="flex gap-2 text-xs items-center text-gray-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Average processing wait time drops to 9 mins</span>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer">
            Broadcast Queue Redirects
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>

        {/* Gate Throughput details */}
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="font-bold text-sm text-white mb-4">Gate Intake Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground pb-2">
                  <th className="py-2">Gate Point</th>
                  <th className="py-2">Check-in Volume</th>
                  <th className="py-2">Total Share</th>
                  <th className="py-2">Queue Delay</th>
                  <th className="py-2 text-right">Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gateMetrics.map((gate) => (
                  <tr key={gate.name} className="hover:bg-white/2.5 transition">
                    <td className="py-3 font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {gate.name}
                    </td>
                    <td className="py-3 text-gray-200">{gate.checkins.toLocaleString()} fans</td>
                    <td className="py-3 text-gray-300 font-medium">{gate.share}</td>
                    <td className="py-3 text-gray-200 font-bold">{gate.wait}</td>
                    <td className="py-3 text-right">
                      <Badge 
                        variant={
                          gate.status === "closed" 
                            ? "error" 
                            : gate.status === "congested" 
                            ? "warning" 
                            : "success"
                        }
                      >
                        {gate.status || "open"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
