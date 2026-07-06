"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, UserRole } from "@/context/AppContext";
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import confetti from "canvas-confetti";

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    // Simulate Firebase Authentication delay
    setTimeout(() => {
      setLoading(false);
      // Auto-assign to organizer for standard sign-in for demonstration
      setUserRole("organizer");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      router.push("/dashboard");
    }, 1500);
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    setUserRole(role);
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      router.push("/dashboard");
    }, 600);
  };

  const quickRoles: { label: string; value: UserRole; desc: string; icon: string }[] = [
    { label: "Organizer", value: "organizer", desc: "Live KPIs & incident management", icon: "📊" },
    { label: "Security Staff", value: "security", desc: "Digital twin map & emergencies", icon: "🛡️" },
    { label: "Medical Responder", value: "medical", desc: "Priority routes & response codes", icon: "🚑" },
    { label: "Volunteer Guide", value: "volunteer", desc: "AI-optimized task dispatch", icon: "🤝" },
    { label: "Match Fan", value: "fan", desc: "Assistant chat & interactive seating", icon: "🎫" },
    { label: "System Admin", value: "admin", desc: "Simulation controls & system parameters", icon: "⚙" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex items-center justify-center py-8">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Left Info Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Gateway Interface</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Access the FIFA 2026 AI Operating Console
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              StadiumOS AI authenticates credentials through Firebase. Select your credential clearance level to log into the real-time operational database.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-xl">🔐</span>
              <div>
                <h4 className="text-xs font-bold text-white">Encrypted Protocols</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">SHA-256 state security protocols active.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-xl">🧠</span>
              <div>
                <h4 className="text-xs font-bold text-white">Gemini Decision Engine</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Assistant models adapt automatically to your logged-in role scope.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card Column */}
        <div className="space-y-6">
          <GlassCard className="p-6 md:p-8" glow>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Operations Login
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firebase Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="name@fifaworldcup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-purple-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Access Token / Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-purple-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting to Firebase...
                  </>
                ) : (
                  <>
                    Sign In Clearance
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role Quick Selector separator */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Or Select Demo Credentials</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Quick Login Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {quickRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleQuickLogin(role.value)}
                  className="flex flex-col text-left p-2.5 rounded-lg border border-white/5 bg-white/2.5 hover:bg-white/5 hover:border-purple-500/30 transition text-xs cursor-pointer group"
                  disabled={loading}
                >
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{role.icon}</span>
                    <span>{role.label}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight group-hover:text-gray-300">
                    {role.desc}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
