"use client";

import React, { useState } from "react";
import { useApp, GateStatus, StadiumScenario } from "@/context/AppContext";
import { 
  Sliders, 
  PlusCircle, 
  Activity, 
  Database,
  RefreshCw,
  Cpu
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import confetti from "canvas-confetti";

export default function AdminPage() {
  const {
    crowdLevel,
    setCrowdLevel,
    gateStatuses,
    setGateStatus,
    activeScenario,
    triggerSimulationScenario,
    addIncident
  } = useApp();

  const [incTitle, setIncTitle] = useState("");
  const [incType, setIncType] = useState<"security" | "medical" | "facility" | "crowd">("security");
  const [incLocation, setIncLocation] = useState("Section 104 (East stand)");
  const [incSeverity, setIncSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [incDesc, setIncDesc] = useState("");

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;

    addIncident({
      title: incTitle,
      type: incType,
      location: incLocation,
      severity: incSeverity,
      description: incDesc,
      status: "reported"
    });

    setIncTitle("");
    setIncDesc("");
    
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const resetAllSimulations = () => {
    triggerSimulationScenario("none");
    setCrowdLevel(0.68);
    confetti({
      particleCount: 50,
      spread: 50,
      colors: ["#10b981", "#3b82f6"]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-400" />
            Admin Simulation Console
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Control live environment telemetry, adjust gates flow capacities, and trigger custom emergency tickets</p>
        </div>

        <button
          onClick={resetAllSimulations}
          className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Simulation Variables</span>
        </button>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Environmental inputs overrides */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6" glow>
            <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Environment Overrides</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Crowd Slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Simulated Seating Density:</span>
                  <span className="text-white font-black">{(crowdLevel * 100).toFixed(0)}% Capacity</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={crowdLevel}
                  onChange={(e) => setCrowdLevel(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Adjusting this scales Recharts timeline capacities and predicted check-in curves.
                </p>
              </div>

              {/* Scenario selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Crisis Scenario Trigger</label>
                <select
                  value={activeScenario}
                  onChange={(e) => triggerSimulationScenario(e.target.value as StadiumScenario)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="none">None (Standard Operations)</option>
                  <option value="gate_closure">Gate Closure (Divert to Gate B/D)</option>
                  <option value="medical_emergency">Cardiac Alert (Elevator Lockout)</option>
                  <option value="heavy_rain">Weather Event (Shelter crowding)</option>
                  <option value="evacuation">Precautionary Evacuation (Stage 1)</option>
                </select>
              </div>

            </div>

            {/* Gates overrides grid */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Individual Gate Ingress Overrides</span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(gateStatuses).map(([name, status]) => (
                  <div key={name} className="p-2.5 bg-white/2.5 border border-white/5 rounded-lg text-xs space-y-1.5">
                    <span className="font-bold text-white block text-[10px] truncate">{name.split(" ")[0]}</span>
                    <select
                      value={status}
                      onChange={(e) => setGateStatus(name, e.target.value as GateStatus)}
                      className="w-full bg-black border border-white/10 rounded px-1 py-0.5 text-[10px] text-white outline-none cursor-pointer"
                    >
                      <option value="open">Open</option>
                      <option value="congested">Congested</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Database & API health logs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 flex gap-3 items-center">
              <div className="text-purple-400"><Database className="w-5 h-5" /></div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Firestore Base</span>
                <p className="text-xs font-bold text-white">Connected (Simulated)</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex gap-3 items-center">
              <div className="text-blue-400"><Cpu className="w-5 h-5" /></div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Gemini API Key</span>
                <p className="text-xs font-bold text-white">
                  {process.env.GEMINI_API_KEY ? "CONFIGURED" : "FALLBACK LOCAL"}
                </p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex gap-3 items-center">
              <div className="text-emerald-400"><Activity className="w-5 h-5" /></div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Telemetry Latency</span>
                <p className="text-xs font-bold text-white">4 ms (Average)</p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Custom Incident Dispatch form */}
        <div className="space-y-6">
          <GlassCard className="p-6" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
              <PlusCircle className="w-4.5 h-4.5 text-purple-400" />
              File Custom Incident Report
            </h3>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Incident Summary / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Broken barricade Section 106"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Type & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Incident Type</label>
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value as "security" | "medical" | "facility" | "crowd")}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="security">Security</option>
                    <option value="medical">Medical</option>
                    <option value="facility">Facility</option>
                    <option value="crowd">Crowd</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Severity</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as "low" | "medium" | "high" | "critical")}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Location Zone</label>
                <select
                  value={incLocation}
                  onChange={(e) => setIncLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Gate A (North)">Gate A (North Entrance)</option>
                  <option value="Gate B (East)">Gate B (East Entrance)</option>
                  <option value="Gate C (South)">Gate C (South Entrance)</option>
                  <option value="Section 104 (East stand)">Section 104 (East Stand)</option>
                  <option value="Section 114 (Concourse South)">Section 114 Concourse</option>
                  <option value="Section 202 (Upper Tier)">Section 202 Upper Tier</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide precise details for dispatch crew..."
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                Submit Incident Ticket
              </button>
            </form>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
