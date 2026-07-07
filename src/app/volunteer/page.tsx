"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  HeartHandshake, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  UserCheck,
  Zap,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function VolunteerPortalPage() {
  const { updateVolunteerStatus, gateStatuses } = useApp();
  const [checkedIn, setCheckedIn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatLogs, setChatLogs] = useState([
    { sender: "Carlos Menendez", msg: "Copy that, heading to Gate B concourse.", time: "22:18" },
    { sender: "Sarah Jenkins", msg: "Gate A queue line is backing up. Turnstile 3 is offline.", time: "22:21" },
    { sender: "System Admin", msg: "Support team dispatched to repair turnstile at Gate A.", time: "22:23" }
  ]);

  const handleCheckInOut = () => {
    setCheckedIn(!checkedIn);
    updateVolunteerStatus("VOL-01", !checkedIn ? "idle" : "off-duty");
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatLogs(prev => [
      ...prev,
      {
        sender: "Sarah Jenkins (You)",
        msg: chatInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setChatInput("");
  };

  // AI Volunteer Optimizer recommendations
  const getOptimizerSuggestion = () => {
    const isGateAClosed = gateStatuses["Gate A (North)"] === "closed" || gateStatuses["Gate A (North)"] === "congested";
    
    if (isGateAClosed) {
      return {
        title: "AI Optimization: Reallocation Required",
        desc: "Due to queue congestion at Gate A (North), the intake wait time has exceeded 20 minutes.",
        recommendation: "Reallocate Carlos Menendez (currently at Main Concourse) to Gate A Queue Control. Reroute shuttle route A to deposit ADA patrons at Gate C rather than Gate A.",
        impact: "Reduces Gate A queue length by 18% in next 10 minutes."
      };
    }
    
    return {
      title: "AI Optimization: Operations Balanced",
      desc: "Gate intake rates are balanced. Seating bowl fill curve is progressing normally.",
      recommendation: "Maintain current post assignments. Sarah Jenkins to check in on Concourse 1 concessions.",
      impact: "Queue levels stable at all sectors."
    };
  };

  const opt = getOptimizerSuggestion();

  // Simulated 10, 20, 30 mins volunteer demand forecasts
  const getPredictiveDemand = () => {
    const isGateAClosed = gateStatuses["Gate A (North)"] === "closed" || gateStatuses["Gate A (North)"] === "congested";
    
    return [
      { time: "+10 mins", location: "Gate A (North)", status: "increase", count: isGateAClosed ? 8 : 2, reason: "Turnstile bottleneck check-ins" },
      { time: "+20 mins", location: "Gate B (East)", status: "increase", count: 4, reason: "Concessions pre-game rush" },
      { time: "+30 mins", location: "ADA Gate 1", status: "stable", count: 0, reason: "Normal ADA shuttle frequency" },
      { time: "+30 mins", location: "Concourse Central", status: "decrease", count: -2, reason: "Spectators seated" }
    ];
  };

  const predictions = getPredictiveDemand();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-purple-400" />
            Volunteer Portal
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Shift check-in/out, live incident coordinator chat, and AI resource optimization logs</p>
        </div>

        <button
          onClick={handleCheckInOut}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
            checkedIn
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{checkedIn ? "Checked In: Active" : "Checked Out: Inactive"}</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: Volunteer optimizer (AI Card) & predictions */}
        <div className="xl:col-span-1 space-y-6">
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Volunteer AI Optimizer
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-purple-500/10 rounded-lg border border-purple-500/20 space-y-2">
                <h4 className="font-bold text-purple-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {opt.title}
                </h4>
                <p className="text-gray-300 leading-relaxed">{opt.desc}</p>
                <p className="font-semibold text-white leading-relaxed">{opt.recommendation}</p>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Estimated Impact</span>
                <p className="text-emerald-400 font-bold">{opt.impact}</p>
              </div>

              <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer">
                Apply Reallocations
              </button>
            </div>
          </GlassCard>

          {/* Predictive Volunteer Demand */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1">
              <Clock className="w-4.5 h-4.5 text-purple-400" />
              AI Volunteer Demand Forecast
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Predictive staff requirements calculated for the next 10, 20, and 30 minutes based on ingress curves.
            </p>
            <div className="space-y-2.5">
              {predictions.map((p, idx) => (
                <div key={idx} className="p-2.5 bg-white/2.5 border border-white/5 rounded text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold block">{p.time} • {p.location}</span>
                    <span className="text-[11px] text-gray-300">{p.reason}</span>
                  </div>
                  
                  {p.status === "increase" ? (
                    <Badge variant="error" className="flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +{p.count} Staff
                    </Badge>
                  ) : p.status === "decrease" ? (
                    <Badge variant="success" className="flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> {p.count} Staff
                    </Badge>
                  ) : (
                    <Badge variant="info">Stable</Badge>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right side: Chat log & Shift logs */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-5 flex flex-col justify-between h-[450px]" glow>
            <div>
              <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
                <MessageCircle className="w-4.5 h-4.5 text-purple-400" />
                Coordination Radio Channel
              </h3>
              
              {/* Message log */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {chatLogs.map((log, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                      <span>{log.sender}</span>
                      <span>{log.time}</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-gray-200">
                      {log.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <input
                type="text"
                placeholder="Report an issue or request help (e.g. 'Turnstile 4 repair complete')"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="flex-1 glass-input rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSendChat}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Send
              </button>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
