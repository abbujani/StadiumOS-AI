"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Settings, 
  Key, 
  User, 
  Bell, 
  Database, 
  Sparkles,
  CheckCircle,
  Save
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import confetti from "canvas-confetti";

export default function SettingsPage() {
  const { userRole } = useApp();
  
  // Profile settings state
  const [username, setUsername] = useState("Operations Director");
  const [email, setEmail] = useState("admin@fifaworldcup.com");
  
  // Keys settings state (synced with localStorage for on-the-fly live calls)
  const [geminiKey, setGeminiKey] = useState("");
  const [firebaseKey, setFirebaseKey] = useState("");
  const [projectId, setProjectId] = useState("stadiumos-worldcup-2026");

  // Notifications state
  const [notifyIncidents, setNotifyIncidents] = useState(true);
  const [notifyTransit, setNotifyTransit] = useState(true);
  const [notifyWeather, setNotifyWeather] = useState(false);

  // Load keys from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGeminiKey(localStorage.getItem("GEMINI_API_KEY") || "");
      setFirebaseKey(localStorage.getItem("FIREBASE_API_KEY") || "");
      setProjectId(localStorage.getItem("FIREBASE_PROJECT_ID") || "stadiumos-worldcup-2026");
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof window !== "undefined") {
      localStorage.setItem("GEMINI_API_KEY", geminiKey);
      localStorage.setItem("FIREBASE_API_KEY", firebaseKey);
      localStorage.setItem("FIREBASE_PROJECT_ID", projectId);
    }

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          System Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configure credential tokens, communication parameters, and notification alerts</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <User className="w-4.5 h-4.5 text-purple-400" />
              Profile Management
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Access Clearance level</label>
                <input
                  type="text"
                  value={`${userRole} view`}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-muted-foreground capitalize outline-none"
                  readOnly
                />
              </div>
            </div>
          </GlassCard>

          {/* Notifications Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <Bell className="w-4.5 h-4.5 text-purple-400" />
              Notification Dispatch
            </h3>

            <div className="space-y-3 text-xs">
              {/* Incidents Toggle */}
              <div className="flex justify-between items-center p-2.5 bg-white/2.5 rounded-lg border border-white/5">
                <div>
                  <h4 className="font-bold text-white">Critical Security Alerts</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Ping when high severity incident alerts are reported.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyIncidents}
                  onChange={(e) => setNotifyIncidents(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Transit Toggle */}
              <div className="flex justify-between items-center p-2.5 bg-white/2.5 rounded-lg border border-white/5">
                <div>
                  <h4 className="font-bold text-white">Transit Delay Summaries</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Alert if shuttle or metro lines experience delays &gt; 10 min.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTransit}
                  onChange={(e) => setNotifyTransit(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Weather Toggle */}
              <div className="flex justify-between items-center p-2.5 bg-white/2.5 rounded-lg border border-white/5">
                <div>
                  <h4 className="font-bold text-white">Environmental Weather Warnings</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Send alert if lightning or heavy rain approaches stadium bounds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWeather}
                  onChange={(e) => setNotifyWeather(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

        </div>

        {/* API Credentials Card */}
        <GlassCard className="p-6 space-y-4" glow>
          <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <Key className="w-4.5 h-4.5 text-purple-400" />
            API & Database Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gemini API Token Key</label>
                  <span className="text-[9px] text-purple-400 font-semibold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> local override
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                />
                <p className="text-[9px] text-muted-foreground leading-normal">
                  Pasting a valid Google Gemini API key will switch AI Assistant Chat and Security Summaries from local simulation to live AI generation. Key is stored locally in your browser.
                </p>
              </div>
            </div>

            {/* Right inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firebase API Clearance Token</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={firebaseKey}
                  onChange={(e) => setFirebaseKey(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firebase Project Identifier</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          >
            <Save className="w-4 h-4" />
            <span>Save System Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
}
