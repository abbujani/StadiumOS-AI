"use client";

import React, { useState } from "react";
import { useApp, Incident } from "@/context/AppContext";
import { 
  Users, 
  Accessibility, 
  LogOut, 
  Map as MapIcon, 
  AlertTriangle, 
  Compass, 
  Activity,
  CheckCircle,
  Sparkles
} from "lucide-react";
import GlassCard from "./GlassCard";
import Badge from "@/components/ui/Badge";

interface InteractiveStadiumTwinProps {
  onIncidentSelect?: (incident: Incident) => void;
}

export const InteractiveStadiumTwin: React.FC<InteractiveStadiumTwinProps> = ({ onIncidentSelect }) => {
  const { 
    gateStatuses, 
    incidents, 
    activeScenario, 
    wheelchairRoutes,
    setWheelchairRoutes,
    reducedMotion
  } = useApp();

  const [overlayMode, setOverlayMode] = useState<"standard" | "density" | "accessibility" | "evacuation">("density");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [forecastMins, setForecastMins] = useState<0 | 10 | 20 | 30>(0);

  // Seating sections with base densities
  const sections = [
    { id: "SEC-N1", name: "North Upper Tier", density: 0.85, x: 250, y: 70, rx: 120, ry: 40, startAngle: 200, endAngle: 340 },
    { id: "SEC-N2", name: "North Lower Tier", density: 0.92, x: 250, y: 110, rx: 80, ry: 25, startAngle: 200, endAngle: 340 },
    
    { id: "SEC-E1", name: "East Upper Tier", density: 0.65, x: 380, y: 180, rx: 50, ry: 100, startAngle: 290, endAngle: 430 },
    { id: "SEC-E2", name: "East Lower Tier", density: 0.78, x: 330, y: 180, rx: 30, ry: 60, startAngle: 290, endAngle: 430 },
    
    { id: "SEC-S1", name: "South Upper Tier", density: 0.52, x: 250, y: 290, rx: 120, ry: 40, startAngle: 20, endAngle: 160 },
    { id: "SEC-S2", name: "South Lower Tier", density: 0.61, x: 250, y: 250, rx: 80, ry: 25, startAngle: 20, endAngle: 160 },
    
    { id: "SEC-W1", name: "West Upper Tier", density: 0.88, x: 120, y: 180, rx: 50, ry: 100, startAngle: 110, endAngle: 250 },
    { id: "SEC-W2", name: "West Lower Tier", density: 0.94, x: 170, y: 180, rx: 30, ry: 60, startAngle: 110, endAngle: 250 },
  ];

  // Coordinates for gate indicators on the SVG
  const gates = [
    { name: "Gate A (North)", x: 250, y: 35 },
    { name: "Gate B (East)", x: 445, y: 180 },
    { name: "Gate C (South)", x: 250, y: 325 },
    { name: "Gate D (West)", x: 55, y: 180 },
  ];

  // Map simulated incident locations to coordinate pins
  const getIncidentCoords = (loc: string) => {
    if (loc.includes("Gate A")) return { x: 230, y: 50 };
    if (loc.includes("Gate B")) return { x: 410, y: 160 };
    if (loc.includes("Gate C")) return { x: 250, y: 295 };
    if (loc.includes("Section 202")) return { x: 300, y: 90 };
    if (loc.includes("Section 114")) return { x: 320, y: 220 };
    return { x: 250, y: 180 };
  };

  // Adjust density dynamically based on scenario and forecast period
  const getPredictedDensity = (secId: string, baseDensity: number) => {
    let multiplier = 1.0;
    
    // If gate closure scenario, East Stand (Gate B) and West Stand (Gate D) see density surge
    if (activeScenario === "gate_closure") {
      if (secId.includes("SEC-E") || secId.includes("SEC-W")) {
        multiplier += (forecastMins / 30) * 0.22;
      } else if (secId.includes("SEC-N")) {
        multiplier -= (forecastMins / 30) * 0.15; // North intake drops
      }
    } else if (activeScenario === "heavy_rain") {
      // Upper tier fans move down to covered lower tiers
      if (secId.includes("2")) {
        multiplier += (forecastMins / 30) * 0.18;
      } else {
        multiplier -= (forecastMins / 30) * 0.10;
      }
    } else if (activeScenario === "evacuation") {
      // Egress clears seating areas slowly
      multiplier -= (forecastMins / 30) * 0.65;
    } else {
      // Normal timeline curve: stadium slowly fills to max prior to kickoff
      multiplier += (forecastMins / 30) * 0.08;
    }

    const calculated = baseDensity * multiplier;
    return Math.min(1.0, Math.max(0.0, calculated));
  };

  // Section density color helper
  const getDensityColor = (density: number) => {
    if (overlayMode === "standard") return "fill-white/10 stroke-white/20";
    if (overlayMode === "accessibility") {
      return density > 0.8 ? "fill-sky-500/30 stroke-sky-400/50" : "fill-white/5 stroke-white/10";
    }
    if (overlayMode === "evacuation") {
      return "fill-emerald-500/20 stroke-emerald-500/50";
    }
    
    if (density < 0.6) return "fill-emerald-500/40 stroke-emerald-500/60";
    if (density < 0.8) return "fill-amber-500/50 stroke-amber-500/70";
    if (density < 0.9) return "fill-orange-500/60 stroke-orange-500/80";
    return "fill-rose-600/70 stroke-rose-500/80";
  };

  // Zone specific AI recommendations
  const getZoneRecommendation = (secId: string) => {
    const isAccess = wheelchairRoutes;
    if (secId.includes("SEC-N")) {
      return {
        zone: "North Quadrant (Gates A / D)",
        recommendation: "North stands are heavily loaded. Route fans through West Gate D corridor. Elevators E2 are at 78% load.",
        action: "Direct overflow traffic to West Promenade."
      };
    }
    if (secId.includes("SEC-E")) {
      return {
        zone: "East Quadrant (Gate B / Section 104)",
        recommendation: isAccess 
          ? "ADA elevator bay E1 is clear. Avoid Gate B escalators due to steep incline."
          : "Gate B is operating at high intake. Food concession queues near Section 105 are 4 mins.",
        action: "Recommend Lobby E1 for wheelchair visitors."
      };
    }
    if (secId.includes("SEC-S")) {
      return {
        zone: "South Quadrant (Gate C)",
        recommendation: "South stands are at 58% capacity. Intake flow is fast. Restrooms behind Section 112 are clear.",
        action: "Ideal entrance point for fast access."
      };
    }
    return {
      zone: "West Quadrant (Gate D)",
      recommendation: "West quadrant is peak loaded (94%). Metro arrivals are concentrating here.",
      action: "Station additional volunteer escorts at Metro platform exits."
    };
  };

  // AI Response Recommendation based on active scenario
  const getAIRecommendation = () => {
    switch (activeScenario) {
      case "gate_closure":
        return {
          title: "AI Response Plan: Gate A Closure",
          risk: "Medium Risk Level (6.4/10)",
          steps: [
            "Initiate digital signage push notifications rerouting approaching fans to Gate B and Gate D.",
            "Deploy 3 volunteers from Main Concourse to Gate B to assist with increased transit load.",
            "Instruct volunteer David Kim to adjust ADA shuttles to concentrate pick-up frequencies at Gate C/D."
          ]
        };
      case "medical_emergency":
        return {
          title: "AI Response Plan: Medical Incident Sect 202",
          risk: "High Risk Level (7.8/10)",
          steps: [
            "Emergency Services notified. Medical Dispatch Team B cleared for elevator priority 3.",
            "Instruct Volunteer Yuki Tanaka (First Aid) to proceed to Section 202 immediately to manage scene crowd safety.",
            "Cleared ingress path from Gate A emergency vehicle dock to Section 202 stairs."
          ]
        };
      case "heavy_rain":
        return {
          title: "AI Response Plan: Weather Event (Heavy Rain)",
          risk: "Medium Risk Level (5.9/10)",
          steps: [
            "Open concourse inner baffle gates to expand immediate shelter space.",
            "Activate overhead screen announcements highlighting covered stadium restaurants and dry zones.",
            "Mobilize cleanup crews to Sections 110-120 and Gate stairways to prevent slip accidents."
          ]
        };
      case "evacuation":
        return {
          title: "CRITICAL ACTION REQUIRED: Precautionary Evacuation",
          risk: "Critical Risk Level (9.8/10)",
          steps: [
            "Broadcast emergency evacuation alarm across PA audio systems in English, Spanish, and French.",
            "Lock all turnstiles in the 'FREE EXIT' open position. Open all perimeter vehicle gates.",
            "Display exit pathway routes on all LED ribbon boards. Security officers to guide fans to Gates A-D."
          ]
        };
      default:
        return {
          title: "AI Operating System: Normal Status",
          risk: "Low Risk Level (1.2/10)",
          steps: [
            "All stadium gates executing normal intake throughput.",
            "Transit feeds operating on schedule. Next peak anticipated post-match (45 mins).",
            "Continuous telemetry monitoring active across crowd heatmaps."
          ]
        };
    }
  };

  const aiRec = getAIRecommendation();
  const zoneRec = selectedSection ? getZoneRecommendation(selectedSection) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stadium SVG map card */}
      <GlassCard className="lg:col-span-2 p-6 flex flex-col items-center relative overflow-hidden" glow>
        <div className="w-full flex justify-between items-center mb-6 z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Compass className="w-5 h-5 text-purple-400" />
              Digital Stadium Twin 2.0
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Live status telemetry for Los Angeles SoFi Stadium</p>
          </div>
          
          <div className="flex gap-1.5 p-1 glass-panel rounded-lg">
            <button 
              onClick={() => setOverlayMode("standard")} 
              className={`p-1.5 rounded-md text-xs transition ${overlayMode === "standard" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-white"}`}
              title="Standard Layout"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setOverlayMode("density")} 
              className={`p-1.5 rounded-md text-xs transition ${overlayMode === "density" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-white"}`}
              title="Crowd Heatmap"
            >
              <Users className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setOverlayMode("accessibility");
                setWheelchairRoutes(true);
              }} 
              className={`p-1.5 rounded-md text-xs transition ${overlayMode === "accessibility" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-white"}`}
              title="Accessibility Paths"
            >
              <Accessibility className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setOverlayMode("evacuation")} 
              className={`p-1.5 rounded-md text-xs transition ${overlayMode === "evacuation" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-white"}`}
              title="Evacuation Routes"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prediction Period Slider */}
        {overlayMode === "density" && (
          <div className="w-full flex items-center justify-between gap-4 p-2 bg-white/5 rounded-lg border border-white/5 mb-4 z-10 text-xs">
            <span className="text-muted-foreground font-semibold">Predictive Egress Timeframe:</span>
            <div className="flex gap-2">
              {([0, 10, 20, 30] as const).map((mins) => (
                <button
                  key={mins}
                  onClick={() => setForecastMins(mins)}
                  className={`px-2.5 py-1 rounded font-bold transition text-[10px] cursor-pointer ${forecastMins === mins ? "bg-purple-600 text-white" : "bg-white/5 text-muted-foreground hover:text-white"}`}
                >
                  {mins === 0 ? "Now" : `+${mins}m`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive SVG Wrapper */}
        <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center my-4">
          <svg viewBox="0 0 500 500" className="w-full h-full select-none">
            {/* outer ring walkway */}
            <ellipse cx="250" cy="180" rx="220" ry="160" className="fill-none stroke-white/5 stroke-[4]" />
            <ellipse cx="250" cy="180" rx="190" ry="135" className="fill-none stroke-white/10 stroke-[2] stroke-dasharray-[6,6]" />

            {/* Invisible paths for animateMotion crowd movement */}
            <path id="outerFlowPath" d="M 455 180 A 205 148 0 1 1 454.9 180" fill="none" />
            <path id="innerFlowPath" d="M 370 180 A 120 80 0 1 1 369.9 180" fill="none" />

            {/* Render seating sections with predicted densities */}
            {sections.map((sec) => {
              const predictedDensity = getPredictedDensity(sec.id, sec.density);
              const startRad = (sec.startAngle * Math.PI) / 180;
              const endRad = (sec.endAngle * Math.PI) / 180;
              const isHovered = hoveredSection === sec.id;
              const isSelected = selectedSection === sec.id;
              
              return (
                <path
                  key={sec.id}
                  d={`
                    M ${sec.x + sec.rx * Math.cos(startRad)} ${sec.y + sec.ry * Math.sin(startRad)}
                    A ${sec.rx} ${sec.ry} 0 0 1 ${sec.x + sec.rx * Math.cos(endRad)} ${sec.y + sec.ry * Math.sin(endRad)}
                    L ${sec.x + (sec.rx - 25) * Math.cos(endRad)} ${sec.y + (sec.ry - 12) * Math.sin(endRad)}
                    A ${sec.rx - 25} ${sec.ry - 12} 0 0 0 ${sec.x + (sec.rx - 25) * Math.cos(startRad)} ${sec.y + (sec.ry - 12) * Math.sin(startRad)}
                    Z
                  `}
                  className={`${getDensityColor(predictedDensity)} transition-all duration-200 cursor-pointer ${
                    isHovered || isSelected ? "stroke-white stroke-[2.5] filter brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "stroke-white/10"
                  }`}
                  onMouseEnter={() => setHoveredSection(sec.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => setSelectedSection(isSelected ? null : sec.id)}
                />
              );
            })}

            {/* Render animated crowd movement nodes if NOT reducedMotion */}
            {!reducedMotion && (
              <>
                {/* Outer ring particles */}
                <circle r="3.5" fill="#c084fc">
                  <animateMotion dur="22s" repeatCount="indefinite" path="M 455 180 A 205 148 0 1 1 454.9 180" />
                </circle>
                <circle r="3" fill="#60a5fa">
                  <animateMotion dur="26s" repeatCount="indefinite" path="M 455 180 A 205 148 0 1 1 454.9 180" begin="6s" />
                </circle>
                <circle r="3" fill="#f472b6">
                  <animateMotion dur="19s" repeatCount="indefinite" path="M 455 180 A 205 148 0 1 1 454.9 180" begin="12s" />
                </circle>

                {/* Inner concourse particles */}
                <circle r="2.5" fill="#a7f3d0">
                  <animateMotion dur="16s" repeatCount="indefinite" path="M 370 180 A 120 80 0 1 1 369.9 180" />
                </circle>
                <circle r="2.5" fill="#fde047">
                  <animateMotion dur="20s" repeatCount="indefinite" path="M 370 180 A 120 80 0 1 1 369.9 180" begin="4s" />
                </circle>
              </>
            )}

            {/* Inner concourse boundary */}
            <ellipse cx="250" cy="180" rx="130" ry="90" className="fill-none stroke-white/10 stroke-[2]" />

            {/* Playing field (Football pitch) */}
            <rect x="180" y="135" width="140" height="90" rx="4" className="fill-emerald-800/40 stroke-emerald-500/40 stroke-[2]" />
            <circle cx="250" cy="180" r="25" className="fill-none stroke-emerald-500/30 stroke-[1.5]" />
            <line x1="250" y1="135" x2="250" y2="225" className="stroke-emerald-500/30 stroke-[1.5]" />

            {/* Accessibility Elevator/Ramp Lines if enabled */}
            {(overlayMode === "accessibility" || wheelchairRoutes) && (
              <>
                {/* ADA Route markers */}
                <ellipse cx="250" cy="180" rx="205" ry="148" className="fill-none stroke-sky-400/40 stroke-[2] stroke-dasharray-[8,6] animate-pulse" />
                <path d="M 60 180 L 170 180 M 440 180 L 330 180" className="stroke-sky-400/50 stroke-[2] stroke-dasharray-[4,4]" />
                <circle cx="170" cy="180" r="8" className="fill-sky-950 stroke-sky-400 stroke-[1.5]" />
                <circle cx="330" cy="180" r="8" className="fill-sky-950 stroke-sky-400 stroke-[1.5]" />
                <text x="166" y="184" className="fill-sky-400 text-[9px] font-bold">♿</text>
                <text x="326" y="184" className="fill-sky-400 text-[9px] font-bold">♿</text>
              </>
            )}

            {/* Evacuation Arrows if active */}
            {overlayMode === "evacuation" && (
              <g className="stroke-emerald-400 stroke-[3] fill-none animate-pulse">
                <path d="M 250 80 L 250 25 M 245 35 L 250 25 L 255 35" />
                <path d="M 250 280 L 250 335 M 245 325 L 250 335 L 255 325" />
                <path d="M 370 180 L 450 180 M 440 175 L 450 180 L 440 185" />
                <path d="M 130 180 L 50 180 M 60 175 L 50 180 L 60 185" />
              </g>
            )}

            {/* Render Gate labels & status dots */}
            {gates.map((gate) => {
              const status = gateStatuses[gate.name] || "open";
              const isClosed = status === "closed";
              const isCongested = status === "congested";
              
              let dotColor = "fill-emerald-400";
              if (isClosed) dotColor = "fill-red-500";
              if (isCongested) dotColor = "fill-amber-500";

              return (
                <g key={gate.name}>
                  <circle cx={gate.x} cy={gate.y} r="7" className="fill-black/60 stroke-white/20 stroke-[1]" />
                  <circle 
                    cx={gate.x} 
                    cy={gate.y} 
                    r="4" 
                    className={`${dotColor} ${isCongested || isClosed ? "animate-ping" : ""}`} 
                  />
                  <circle 
                    cx={gate.x} 
                    cy={gate.y} 
                    r="4" 
                    className={dotColor} 
                  />
                  <text 
                    x={gate.x} 
                    y={gate.y + (gate.y > 180 ? 18 : -12)} 
                    textAnchor="middle" 
                    className="fill-white text-[10px] font-semibold bg-black"
                  >
                    {gate.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            {/* Render active incident pins */}
            {incidents.filter(inc => inc.status !== "resolved").map((inc) => {
              const coords = getIncidentCoords(inc.location);
              const isHigh = inc.severity === "high" || inc.severity === "critical";
              return (
                <g 
                  key={inc.id} 
                  className="cursor-pointer"
                  onClick={() => onIncidentSelect?.(inc)}
                >
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r="10" 
                    className={`stroke-[1.5] ${isHigh ? "fill-red-500/30 stroke-red-500 animate-pulse" : "fill-amber-500/30 stroke-amber-500"}`} 
                  />
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r="4" 
                    className={isHigh ? "fill-red-500" : "fill-amber-500"} 
                  />
                  <text x={coords.x - 3} y={coords.y + 4} className="fill-white text-[11px] font-bold">!</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Legend */}
        <div className="w-full flex justify-between items-center text-xs text-muted-foreground mt-2 pt-4 border-t border-white/5">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal Flow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Heavy Load
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Bottleneck / Closed
            </span>
          </div>
          
          {selectedSection && (
            <div className="text-right">
              {sections.filter(s => s.id === selectedSection).map(s => {
                const predictedDensity = getPredictedDensity(s.id, s.density);
                return (
                  <span key={s.id} className="text-white font-medium">
                    {s.name}: {(predictedDensity * 100).toFixed(0)}% Cap
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </GlassCard>

      {/* AI Recommendation Panel with Zone context */}
      <GlassCard className="p-6 flex flex-col justify-between" glow>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Decision Support
            </h3>
            {activeScenario !== "none" ? (
              <Badge variant="error" className="pulse-risk">SIMULATION ACTIVE</Badge>
            ) : (
              <Badge variant="success">SYSTEM NOMINAL</Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
              <span className="text-muted-foreground">Scenario Triggered:</span>
              <span className="font-semibold text-white capitalize">{activeScenario.replace("_", " ")}</span>
            </div>
            
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4" />
                {aiRec.title}
              </h4>
              <p className="text-xs text-white/80">{aiRec.risk}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Recommended Dispatch Actions:</p>
              {aiRec.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                  <span className="text-purple-400 font-bold leading-relaxed">{idx + 1}.</span>
                  <p className="leading-relaxed text-gray-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Context-aware zone recommendation */}
          {zoneRec ? (
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 space-y-1.5 mt-2 animate-pulse">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">📍 Zone Context: {zoneRec.zone}</span>
              <p className="text-xs text-gray-200 leading-relaxed">{zoneRec.recommendation}</p>
              <span className="text-[10px] text-blue-300 block font-semibold">AI Action: {zoneRec.action}</span>
            </div>
          ) : (
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-muted-foreground text-center italic mt-2">
              Click on any tiered seating section of the stadium twin map to retrieve local zone-specific AI dispatch suggestions.
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
          {activeScenario !== "none" ? (
            <div className="w-full text-xs text-amber-300 flex items-start gap-1.5 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Simulated constraints are applied. Switch the active scenario in the Admin Panel to reset.</span>
            </div>
          ) : (
            <div className="w-full text-xs text-emerald-400 flex items-start gap-1.5 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>AI Command Center is actively listening for voice or text requests.</span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default InteractiveStadiumTwin;
