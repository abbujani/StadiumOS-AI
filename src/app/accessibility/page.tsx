"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Type, 
  Compass, 
  Play,
  Languages,
  Activity
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function AccessibilityPage() {
  const {
    voiceNavigation,
    setVoiceNavigation,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    wheelchairRoutes,
    setWheelchairRoutes,
    reducedMotion,
    setReducedMotion,
    gateStatuses
  } = useApp();

  const [simulatedSpeech, setSimulatedSpeech] = useState<string>(
    "Welcome to SoFi Stadium. Accessibility modes are fully loaded. Accessibility menu is currently active."
  );

  const triggerScreenReaderSimulation = (category: string) => {
    let speechText = "";
    if (category === "gates") {
      const activeCongested = Object.entries(gateStatuses)
        .filter(([, status]) => status !== "open")
        .map(([name, status]) => `${name} is currently ${status}`);
        
      speechText = `Gates intake report. ${
        activeCongested.length > 0 
          ? `Attention. ${activeCongested.join(". ")}. All other gates are running with standard queues.` 
          : "All stadium gates are open and operating normally."
      }`;
    } else if (category === "restrooms") {
      speechText = "Restroom assistance. Elevator access is available at lobby E1. Wheelchair-accessible toilets are located behind Section 105, 112, and 124. Current queue times are under two minutes.";
    } else {
      speechText = "Emergency announcement check. All egress lines are nominal. In the event of emergency, green exit lights will guide you to Gates B, C, or D.";
    }
    
    setSimulatedSpeech(speechText);
    
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const voiceCommands = [
    { cmd: '"Where is Section 104?"', desc: "AI responds with gate directions, transit time, and lift zones." },
    { cmd: '"Locate closest accessible washroom"', desc: "Locates ADA bathrooms with lowest current queues." },
    { cmd: '"Activate emergency medical help"', desc: "Dispatches medical EMTs immediately to Section 104." },
    { cmd: '"Is Gate A open?"', desc: "Check if Gate A has queue bottlenecks or closures." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Accessibility className="w-6 h-6 text-purple-400" />
          Accessibility Portal
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">WCAG AAA compliant visual scaling, voice synthesis, and assistive wheelchair routing config</p>
      </div>

      {/* Toggles Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Settings Grid */}
        <GlassCard className="p-6 space-y-6" glow>
          <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Assistive Controls</h3>
          
          <div className="space-y-4">
            
            {/* High Contrast */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">High Contrast Mode</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Increases text color luminance ratio to 7:1 for WCAG compliance.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Large Text */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Large Typography Scale</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Increases base HTML font sizes for overall readability.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Voice Navigation */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Voice Navigation Assist</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Read AI dashboard notifications aloud using browser speech engines.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={voiceNavigation}
                onChange={(e) => setVoiceNavigation(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Wheelchair Accessible */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Wheelchair Priority Paths</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Reroutes standard maps to bypass stairs, highlighting elevators and ramps.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={wheelchairRoutes}
                onChange={(e) => setWheelchairRoutes(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Reduced Motion Option</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Disables animated crowd flow particles on the digital twin map to prevent visual distraction.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

          </div>
        </GlassCard>

        {/* Screen Reader simulator & speech box */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col justify-between h-full" glow>
            <div>
              <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-400" />
                Screen Reader Text Output
              </h3>
              <p className="text-[10px] text-muted-foreground mb-4">Click button to read telemetry updates aloud (simulates visual reader speech)</p>
              
              <div className="p-4 bg-zinc-950 border border-white/5 rounded-lg text-xs text-purple-300 font-mono min-h-24 whitespace-pre-line leading-relaxed">
                📢 {simulatedSpeech}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-[10px]">
                <button
                  onClick={() => triggerScreenReaderSimulation("gates")}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-purple-400" /> Read Gates
                </button>
                <button
                  onClick={() => triggerScreenReaderSimulation("restrooms")}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-purple-400" /> Read Washrooms
                </button>
                <button
                  onClick={() => triggerScreenReaderSimulation("emergency")}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-purple-400" /> Read Safety
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>Accessibility engine matches browser system language (supports multilanguage translations).</span>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Voice commands list card */}
      <GlassCard className="p-6">
        <h3 className="font-bold text-sm text-white mb-4">Supported Voice Triggers glossary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voiceCommands.map((v, idx) => (
            <div key={idx} className="p-3 bg-white/2.5 rounded-lg border border-white/5 flex flex-col text-xs space-y-1">
              <span className="font-mono text-purple-300 font-extrabold">{v.cmd}</span>
              <span className="text-muted-foreground text-[11px]">{v.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
}
