"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useApp, Incident } from "@/context/AppContext";
import { 
  Users, 
  Activity,
  ArrowRight,
  AlertTriangle,
  BrainCircuit,
  Settings,
  Sparkles,
  Terminal,
  Printer,
  TrendingUp,
  Cpu
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const InteractiveStadiumTwin = dynamic(
  () => import("@/components/ui/InteractiveStadiumTwin"),
  {
    ssr: false,
    loading: () => <div className="h-[400px] bg-white/5 animate-pulse rounded-lg border border-white/5 flex items-center justify-center text-xs text-muted-foreground">Loading Interactive Stadium Twin...</div>
  }
);
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Link from "next/link";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";

export default function DashboardPage() {
  const { 
    userRole, 
    crowdLevel, 
    gateStatuses, 
    incidents, 
    volunteers, 
    transitFeeds, 
    activeScenario,
    resolveIncident,
    assignVolunteer,
    triggerSimulationScenario,
    stadiumHealth,
    crowdRisk,
    aiConfidence
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Command Center Query State
  const [commandQuery, setCommandQuery] = useState("");
  const [commandResult, setCommandResult] = useState("");
  const [loadingCommand, setLoadingCommand] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assigneeId, setAssigneeId] = useState("");

  // Recharts & UI hydration guard
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch executive summary
  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setTimeout(() => {
      setLoadingSummary(true);
    }, 0);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "summary",
        gateStatuses,
        incidents,
        activeScenario,
        crowdLevel
      })
    })
      .then(res => res.json())
      .then(data => {
        setExecutiveSummary(data.result || "Could not retrieve operational briefing.");
        setLoadingSummary(false);
      })
      .catch(err => {
        console.error("Error fetching summary:", err);
        setLoadingSummary(false);
      });

    return () => clearTimeout(timer);
  }, [isMounted, gateStatuses, incidents, activeScenario, crowdLevel]);

  const handleRunCommand = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandQuery.trim()) return;

    setLoadingCommand(true);
    setCommandResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "command",
          query: commandQuery,
          gateStatuses,
          incidents,
          activeScenario,
          crowdLevel
        })
      });
      const data = await res.json();
      setCommandResult(data.result || "No results found.");
    } catch {
      setCommandResult("Error connecting to AI Command core. Please check API credentials.");
    } finally {
      setLoadingCommand(false);
    }
  }, [commandQuery, gateStatuses, incidents, activeScenario, crowdLevel]);

  const handlePrintMatchBrief = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const activeIncidents = incidents
      .filter(i => i.status !== "resolved")
      .map(i => `<li><strong>[${i.severity.toUpperCase()}]</strong> ${i.title} - Location: ${i.location} (Status: ${i.status})</li>`)
      .join("");

    const transitDetails = transitFeeds
      .map(t => `<li>${t.line} - Status: ${t.status} (Passenger load: ${t.load})</li>`)
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>FIFA World Cup 2026 - Operations Match Brief</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #111827; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { color: #7c3aed; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 5px; }
            .meta { font-size: 12px; color: #6b7280; margin-bottom: 30px; }
            .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; background: #f9fafb; text-align: center; }
            .card h3 { margin: 0 0 5px 0; font-size: 10px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; }
            .card p { margin: 0; font-size: 18px; font-weight: 800; color: #111827; }
            h2 { color: #1f2937; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 6px; font-size: 13px; }
            .summary { background: #faf5ff; border: 1px solid #f3e8ff; padding: 15px; border-radius: 8px; font-size: 13px; white-space: pre-line; }
          </style>
        </head>
        <body>
          <h1>StadiumOS AI Executive Brief</h1>
          <div class="meta">FIFA World Cup 2026 venue operations report • SoFi Stadium, Los Angeles • Generated: ${new Date().toLocaleString()}</div>
          
          <div class="grid">
            <div class="card">
              <h3>Stadium Health</h3>
              <p>${stadiumHealth}%</p>
            </div>
            <div class="card">
              <h3>Crowd Risk</h3>
              <p>${crowdRisk}%</p>
            </div>
            <div class="card">
              <h3>Attendance Load</h3>
              <p>${(crowdLevel * 100).toFixed(0)}%</p>
            </div>
            <div class="card">
              <h3>AI Confidence</h3>
              <p>${aiConfidence}%</p>
            </div>
          </div>

          <h2>Executive Briefing Summary</h2>
          <div class="summary">${executiveSummary || "No operational brief available."}</div>

          <h2>Active Incidents</h2>
          <ul>${activeIncidents || "<li>No active incident tickets.</li>"}</ul>

          <h2>Transit Networks</h2>
          <ul>${transitDetails}</ul>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [stadiumHealth, crowdRisk, crowdLevel, aiConfidence, executiveSummary, incidents, transitFeeds]);

  // Simulated chart curves
  const ingressData = useMemo(() => [
    { time: "18:00", standard: 5000, actual: 4800 },
    { time: "19:00", standard: 12000, actual: 11500 },
    { time: "20:00", standard: 25000, actual: 23000 },
    { time: "21:00", standard: 45000, actual: 41000 },
    { time: "22:00", standard: 65000, actual: 62840 },
    { time: "23:00", standard: 70000, actual: 68401 },
  ], []);

  const queueData = useMemo(() => [
    { name: "Gate A", wait: gateStatuses["Gate A (North)"] === "closed" ? 0 : gateStatuses["Gate A (North)"] === "congested" ? 28 : 12, capacity: 85 },
    { name: "Gate B", wait: gateStatuses["Gate B (East)"] === "congested" ? 22 : 6, capacity: 90 },
    { name: "Gate C", wait: 4, capacity: 55 },
    { name: "Gate D", wait: 8, capacity: 70 },
    { name: "ADA Gate 1", wait: 2, capacity: 40 },
  ], [gateStatuses]);

  const activeIncidents = useMemo(() => incidents.filter(i => i.status !== "resolved"), [incidents]);

  if (!isMounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            AI Mission Control Room
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-purple-400 capitalize">
              {userRole} view
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">FIFA World Cup 2026 real-time venue operations dashboard</p>
        </div>
      </div>

      {/* Upgraded Telemetry Card Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stadium Health */}
        <GlassCard className="p-4 flex items-center gap-3.5" hoverGlow>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Stadium Health</p>
            <h3 className="text-lg font-black text-white mt-0.5">
              <AnimatedCounter value={stadiumHealth} suffix="%" />
            </h3>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Nominal
            </span>
          </div>
        </GlassCard>

        {/* Live Attendance */}
        <GlassCard className="p-4 flex items-center gap-3.5" hoverGlow>
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Live Attendance</p>
            <h3 className="text-lg font-black text-white mt-0.5">
              <AnimatedCounter value={68401} />
            </h3>
            <span className="text-[9px] text-muted-foreground">97.7% Seating Cap</span>
          </div>
        </GlassCard>

        {/* Crowd Risk */}
        <GlassCard className="p-4 flex items-center gap-3.5" hoverGlow>
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Crowd Risk Level</p>
            <h3 className="text-lg font-black text-white mt-0.5">
              <AnimatedCounter value={crowdRisk} suffix="%" />
            </h3>
            <span className="text-[9px] text-amber-400 font-semibold">
              {activeIncidents.length} active tickets
            </span>
          </div>
        </GlassCard>

        {/* AI Confidence */}
        <GlassCard className="p-4 flex items-center gap-3.5" hoverGlow>
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">AI Model Confidence</p>
            <h3 className="text-lg font-black text-white mt-0.5">
              <AnimatedCounter value={aiConfidence} suffix="%" />
            </h3>
            <span className="text-[9px] text-purple-400 font-semibold flex items-center gap-0.5">
              <Cpu className="w-3 h-3" /> Gemini 1.5
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: AI brief + Recharts curves */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Executive Summary Brief with Exporter */}
          <GlassCard className="p-5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Executive AI Match Briefing
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePrintMatchBrief}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export Report PDF</span>
                </button>
                <Badge variant="purple">Gemini API</Badge>
              </div>
            </div>

            {loadingSummary ? (
              <div className="space-y-2.5 py-3">
                <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse w-2/3"></div>
              </div>
            ) : (
              <div className="text-xs leading-relaxed text-gray-200 whitespace-pre-line space-y-2 border-l-2 border-purple-500/30 pl-3">
                {executiveSummary}
              </div>
            )}
          </GlassCard>

          {/* AI Command Center Prompts terminal */}
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              AI Command Terminal
            </h3>

            <form onSubmit={handleRunCommand} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask operations queries... (e.g. 'Which gate is most crowded?', 'Suggest evacuation steps')"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="flex-grow glass-input rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                disabled={loadingCommand}
              >
                {loadingCommand ? "Processing..." : "Run AI Command"}
              </button>
            </form>

            {loadingCommand && (
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
              </div>
            )}

            {commandResult && !loadingCommand && (
              <div className="mt-4 p-4 bg-zinc-950 border border-white/5 rounded-lg text-xs text-purple-300 font-mono whitespace-pre-line leading-relaxed">
                {commandResult}
              </div>
            )}
          </GlassCard>

          {/* Recharts Analytics graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-5">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center justify-between">
                <span>Ingress Flow Timeline</span>
                <span className="text-[10px] text-muted-foreground font-normal">Cumulative check-ins</span>
              </h3>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ingressData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" />
                    <YAxis stroke="rgba(255,255,255,0.4)" />
                    <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                    <Line type="monotone" dataKey="actual" name="Actual Attendance" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="standard" name="Projected Curve" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center justify-between">
                <span>Gate Queue wait times (minutes)</span>
                <span className="text-[10px] text-muted-foreground font-normal">Live turnstile sensors</span>
              </h3>
              <div className="h-48 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={queueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                    <YAxis stroke="rgba(255,255,255,0.4)" />
                    <Tooltip contentStyle={{ backgroundColor: "#0b0b1a", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                    <Bar dataKey="wait" name="Wait time (min)" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {queueData.map((entry, index) => (
                        <rect 
                          key={`rect-${index}`} 
                          fill={entry.wait > 20 ? "#f43f5e" : entry.wait > 10 ? "#f59e0b" : "#10b981"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Right Column: Actions Panels */}
        <div>
          <GlassCard className="p-5 h-full flex flex-col justify-between" glow>
            <div>
              <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Role Action Center
              </h3>

              {/* RENDER ROLE SPECIFIC CONTENT */}
              {userRole === "fan" && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs text-blue-300">
                    📢 **Welcome, Fan!** You can use the AI assistant to locate seats, look up food menus, or check local shuttle schedules.
                  </div>
                  <div className="space-y-2">
                    <Link href="/ai-assistant">
                      <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
                        Launch Chat Assistant
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <Link href="/navigation">
                      <button className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs rounded-lg transition cursor-pointer">
                        Find My Seat Direction
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {userRole === "organizer" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Crisis Simulation Overrides</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button 
                      onClick={() => triggerSimulationScenario(activeScenario === "gate_closure" ? "none" : "gate_closure")} 
                      className={`p-2 rounded border transition cursor-pointer ${activeScenario === "gate_closure" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/10 hover:bg-white/5 text-gray-200"}`}
                    >
                      Gate Closure
                    </button>
                    <button 
                      onClick={() => triggerSimulationScenario(activeScenario === "medical_emergency" ? "none" : "medical_emergency")} 
                      className={`p-2 rounded border transition cursor-pointer ${activeScenario === "medical_emergency" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/10 hover:bg-white/5 text-gray-200"}`}
                    >
                      Medical Emergency
                    </button>
                    <button 
                      onClick={() => triggerSimulationScenario(activeScenario === "heavy_rain" ? "none" : "heavy_rain")} 
                      className={`p-2 rounded border transition cursor-pointer ${activeScenario === "heavy_rain" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/10 hover:bg-white/5 text-gray-200"}`}
                    >
                      Heavy Rain
                    </button>
                    <button 
                      onClick={() => triggerSimulationScenario(activeScenario === "evacuation" ? "none" : "evacuation")} 
                      className={`p-2 rounded border transition cursor-pointer ${activeScenario === "evacuation" ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse font-bold" : "border-white/10 hover:bg-white/5 text-gray-200"}`}
                    >
                      Evacuation Strategy
                    </button>
                  </div>
                  {activeScenario !== "none" && (
                    <button 
                      onClick={() => triggerSimulationScenario("none")} 
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Clear Active Scenario
                    </button>
                  )}
                </div>
              )}

              {userRole === "volunteer" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Assigned Volunteer Tasks</span>
                  <div className="space-y-2">
                    {volunteers.filter(v => v.name === "Sarah Jenkins").map(v => (
                      <div key={v.id} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-white">{v.role}</span>
                          <Badge variant="warning">{v.status}</Badge>
                        </div>
                        <p className="text-[11px] text-gray-300">{v.currentTask || "Idle. Ready for dispatch."}</p>
                        {v.assignedLocation && <span className="text-[9px] text-purple-400 mt-1 block">📌 {v.assignedLocation}</span>}
                      </div>
                    ))}
                    <Link href="/volunteer">
                      <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer">
                        Open Volunteer Board
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {userRole === "security" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Active Incidents</span>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeIncidents.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No active incident reports.</p>
                    ) : (
                      activeIncidents.map(inc => (
                        <div 
                          key={inc.id} 
                          onClick={() => setSelectedIncident(inc)}
                          className={`p-2.5 rounded-lg border transition cursor-pointer text-xs ${selectedIncident?.id === inc.id ? "bg-purple-500/20 border-purple-500" : "bg-white/2.5 border-white/5 hover:bg-white/5"}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{inc.id}</span>
                            <Badge variant={inc.severity === "high" || inc.severity === "critical" ? "error" : "warning"}>{inc.severity}</Badge>
                          </div>
                          <p className="font-semibold text-gray-200 text-[11px]">{inc.title}</p>
                          <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground">
                            <span>Loc: {inc.location}</span>
                            <span className="capitalize">{inc.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {selectedIncident && (
                    <div className="p-3 bg-white/5 rounded-lg border border-purple-500/30 text-xs space-y-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Manage Case: {selectedIncident.id}</span>
                        <button onClick={() => setSelectedIncident(null)} className="text-muted-foreground text-[10px] hover:text-white">Close</button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{selectedIncident.description}</p>
                      
                      {selectedIncident.status !== "resolved" && (
                        <div className="flex gap-2 pt-1">
                          <select 
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="bg-black border border-white/10 text-[10px] text-white rounded px-2 py-1 outline-none"
                          >
                            <option value="">Select Volunteer</option>
                            {volunteers.filter(v => v.status === "idle").map(v => (
                              <option key={v.id} value={v.id}>{v.name} ({v.role})</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => {
                              if (!assigneeId) return;
                              assignVolunteer(selectedIncident.id, assigneeId);
                              setSelectedIncident(null);
                              setAssigneeId("");
                            }}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Assign
                          </button>
                          <button 
                            onClick={() => {
                              resolveIncident(selectedIncident.id);
                              setSelectedIncident(null);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {userRole === "medical" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Medical Coordinator Dispatch</span>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-xs text-red-300 space-y-1">
                    <p className="font-bold">⚠️ Critical Emergency Support</p>
                    <p className="text-[11px] text-gray-300">EMT response vehicles cleared for emergency Gate C docking corridors.</p>
                  </div>
                  <div className="space-y-2">
                    {incidents.filter(i => i.type === "medical" && i.status !== "resolved").map(inc => (
                      <div key={inc.id} className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-white">{inc.id} - {inc.location}</span>
                          <Badge variant="error">{inc.severity}</Badge>
                        </div>
                        <p className="text-gray-300 text-[11px] font-semibold">{inc.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{inc.description}</p>
                        <button 
                          onClick={() => resolveIncident(inc.id)}
                          className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded transition cursor-pointer"
                        >
                          Resolve & Close File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {userRole === "admin" && (
                <div className="space-y-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Admin Telemetry Console</span>
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Crowd Multiplier:</span>
                        <span className="text-white font-bold">{(crowdLevel * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={crowdLevel} 
                        className="w-full accent-purple-500"
                        readOnly
                      />
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-muted-foreground space-y-1">
                      <p className="font-bold text-white">System Integrity: 100%</p>
                      <p>Firebase Listener: CONNECTED</p>
                      <p>Gemini AI Model: ACTIVE</p>
                    </div>

                    <Link href="/admin">
                      <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer">
                        <Settings className="w-3.5 h-3.5" />
                        Configure Admin Simulator
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <span className="text-[10px] text-muted-foreground font-semibold">StadiumOS AI Core Platform v2.4.6</span>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Interactive Stadium Twin Section */}
      <div className="mt-8">
        <InteractiveStadiumTwin onIncidentSelect={(inc) => {
          if (userRole === "security" || userRole === "organizer") {
            setSelectedIncident(inc);
          }
        }} />
      </div>

    </div>
  );
}
