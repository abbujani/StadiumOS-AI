"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Globe, 
  ChevronRight,
  Accessibility,
  Flame,
  Leaf
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function LandingPage() {
  const [attendeeCount, setAttendeeCount] = useState(62840);
  const [carbonOffset, setCarbonOffset] = useState(1420.5);

  // Tick simulation to make landing feel alive
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

  const roles = [
    { title: "Fans", desc: "AI-driven navigation, digital seat finder, concession pre-ordering, and voice-guided assistance.", icon: "🎫", color: "from-blue-500/20 to-cyan-500/20" },
    { title: "Organizers", desc: "Live operations command, transit scheduling, resource optimization, and executive summaries.", icon: "📊", color: "from-purple-500/20 to-pink-500/20" },
    { title: "Volunteers", desc: "AI-optimized task dispatch, live language translation, and crowd escort directions.", icon: "🤝", color: "from-emerald-500/20 to-teal-500/20" },
    { title: "Security Team", desc: "Live crowd heatmaps, queue predictions, incident summaries, and automated response plans.", icon: "🛡️", color: "from-rose-500/20 to-orange-500/20" },
    { title: "Medical Responders", desc: "Immediate incident routing, priority elevator dispatch, and emergency logs.", icon: "🚑", color: "from-red-500/20 to-rose-500/20" },
    { title: "System Admins", desc: "Full simulation overrides, environment telemetry control, and system integrity logs.", icon: "⚙️", color: "from-zinc-500/20 to-slate-500/20" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-62px)] flex flex-col justify-center items-center py-10 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full px-4 space-y-12 z-10">
        
        {/* Hero Copy */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Venue Operations</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
            StadiumOS <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            The Intelligent Generative AI Operating System for FIFA World Cup 2026.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/login">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] flex items-center gap-2 group cursor-pointer">
                Enter Operations Console
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/ai-assistant">
              <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer">
                Talk to Assistant
              </button>
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Roles Feature Showcase */}
        <div className="space-y-6 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Selectable Persona Scopes</h2>
            <p className="text-xs text-muted-foreground mt-1">Explore StadiumOS AI from any user viewpoint via the Navbar scope switcher.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <GlassCard key={role.title} className="p-5 relative group overflow-hidden" hoverGlow>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${role.color} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none`}></div>
                
                <div className="text-3xl mb-3">{role.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  {role.title} Portal
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-400" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground pt-12 border-t border-white/5">
          <p>© 2026 FIFA World Cup Operations AI Platform. Powered by Google Gemini API.</p>
        </div>

      </div>
    </div>
  );
}
