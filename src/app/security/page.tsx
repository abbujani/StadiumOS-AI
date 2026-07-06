"use client";

import React, { useEffect, useState } from "react";
import { useApp, Incident } from "@/context/AppContext";
import { 
  ShieldAlert, 
  Radio, 
  Camera, 
  Brain
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function SecurityPage() {
  const { 
    incidents, 
    volunteers, 
    activeScenario, 
    resolveIncident, 
    assignVolunteer 
  } = useApp();

  const [selectedInc, setSelectedInc] = useState<Incident | null>(null);
  const [aiPlan, setAiPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [cctvTime, setCctvTime] = useState("");

  // Update CCTV time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCctvTime(now.toLocaleTimeString() + `.${Math.floor(Math.random() * 9)}`);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Fetch emergency response plan when incident is selected
  useEffect(() => {
    if (!selectedInc) {
      const timer = setTimeout(() => {
        setAiPlan("");
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLoadingPlan(true);
    }, 0);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "emergency",
        activeScenario: selectedInc.type === "medical" ? "medical_emergency" : selectedInc.type === "crowd" ? "gate_closure" : "none",
        incidents: [selectedInc]
      })
    })
      .then(res => res.json())
      .then(data => {
        setAiPlan(data.result || "No protocol found.");
        setLoadingPlan(false);
      })
      .catch(err => {
        console.error("Plan fetch error:", err);
        setLoadingPlan(false);
      });

    return () => clearTimeout(timer);
  }, [selectedInc]);

  const activeTickets = incidents.filter(i => i.status !== "resolved");

  // Determine Overall Risk Level based on tickets and scenario
  const getRiskScore = () => {
    if (activeScenario === "evacuation") return { level: "CRITICAL", score: "9.8 / 10", color: "text-red-500 bg-red-500/10 border-red-500/25" };
    if (activeScenario === "medical_emergency") return { level: "HIGH", score: "7.4 / 10", color: "text-rose-500 bg-rose-500/10 border-rose-500/25" };
    if (activeScenario === "gate_closure" || activeScenario === "heavy_rain") return { level: "ELEVATED", score: "5.6 / 10", color: "text-amber-500 bg-amber-500/10 border-amber-500/25" };
    if (activeTickets.length > 2) return { level: "MODERATE", score: "3.2 / 10", color: "text-blue-500 bg-blue-500/10 border-blue-500/25" };
    return { level: "NOMINAL", score: "1.2 / 10", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" };
  };

  const risk = getRiskScore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            Security & Dispatch Control Room
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Automated threat monitoring, CCTV feeds, incident checklists, and volunteer dispatching</p>
        </div>

        {/* Global Threat Bar */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${risk.color} text-xs font-black animate-pulse`}>
          <Radio className="w-4 h-4" />
          <span>THREAT STATUS: {risk.level} ({risk.score})</span>
        </div>
      </div>

      {/* Main Grid Layout: Left incidents list, Middle CCTV feeds, Right Dispatch options */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Tickets Queue */}
        <div className="space-y-6">
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center justify-between">
              <span>Incident Tickets Queue</span>
              <Badge variant="purple">{activeTickets.length} cases</Badge>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {activeTickets.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground italic">
                  No active incidents. System nominal.
                </div>
              ) : (
                activeTickets.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedInc(selectedInc?.id === inc.id ? null : inc);
                      setAssigneeId("");
                    }}
                    className={`p-3.5 rounded-lg border transition cursor-pointer text-xs space-y-2 ${selectedInc?.id === inc.id ? "bg-purple-500/20 border-purple-500" : "bg-white/2.5 border-white/5 hover:bg-white/5"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white">{inc.id}</span>
                      <Badge variant={inc.severity === "high" || inc.severity === "critical" ? "error" : "warning"}>
                        {inc.severity}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-gray-200">{inc.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{inc.description}</p>
                    
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1">📍 {inc.location}</span>
                      <span className="capitalize font-semibold">{inc.status}</span>
                    </div>

                    {inc.volunteerAssigned && (
                      <div className="text-[9px] text-purple-400 font-bold">
                        Assignee: {inc.volunteerAssigned}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Middle Column: CCTV Feeds */}
        <div className="space-y-6">
          <GlassCard className="p-5">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center justify-between">
              <span>CCTV Telemetry Feeds</span>
              <span className="text-[10px] text-red-500 font-mono flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> REC LIVE
              </span>
            </h3>

            {/* Video feeds grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { cam: "CAM-01", name: "Gate A turnstile" },
                { cam: "CAM-02", name: "Section 104 Concourse" },
                { cam: "CAM-03", name: "East stairs escape" },
                { cam: "CAM-04", name: "First Aid corridor" }
              ].map((c) => (
                <div key={c.cam} className="aspect-video bg-zinc-950 border border-white/5 rounded-lg relative overflow-hidden flex items-center justify-center group">
                  {/* CCTV static texture */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10 opacity-70"></div>
                  <div className="absolute top-1 left-2 text-[9px] font-mono text-emerald-400 z-10">{c.cam} - {c.name}</div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono text-emerald-400 z-10">{cctvTime}</div>
                  
                  {/* Flickering CCTV line effect */}
                  <div className="absolute left-0 right-0 h-[1px] bg-emerald-500/20 top-1/2 -translate-y-1/2 animate-bounce z-10"></div>
                  
                  {/* Render camera placeholder icon */}
                  <Camera className="w-5 h-5 text-emerald-500/40 group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
              *Camera streams are automatically scanned by AI. Rapid crowd congestion or slip hazards trigger alert tickets in the queue.
            </p>
          </GlassCard>
        </div>

        {/* Right Column: AI Dispatch & Checklists */}
        <div className="space-y-6">
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              AI Incident Response
            </h3>

            {selectedInc ? (
              <div className="space-y-4">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">Selected Case</span>
                  <span className="text-xs font-bold text-white">{selectedInc.id}: {selectedInc.title}</span>
                </div>

                {loadingPlan ? (
                  <div className="space-y-2 py-3">
                    <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                    <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-white/5 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line bg-purple-500/5 p-3 rounded-lg border border-purple-500/20">
                    {aiPlan}
                  </div>
                )}

                {/* Dispatch Controls Form */}
                {selectedInc.status !== "resolved" && (
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Assign Response Staff</span>
                    
                    <div className="flex gap-2">
                      <select
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="">Choose idle volunteer...</option>
                        {volunteers.filter(v => v.status === "idle").map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.role})</option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => {
                          if (!assigneeId) return;
                          assignVolunteer(selectedInc.id, assigneeId);
                          setSelectedInc(null);
                        }}
                        className="px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded transition cursor-pointer"
                        disabled={!assigneeId}
                      >
                        Dispatch
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        resolveIncident(selectedInc.id);
                        setSelectedInc(null);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Mark Case as Resolved
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-20 text-center text-xs text-muted-foreground italic">
                Select an active ticket from the Queue to generate AI Response Plans and dispatch staff.
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
