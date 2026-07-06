"use client";

import React, { useState } from "react";
import { useApp, StadiumScenario } from "@/context/AppContext";
import { 
  Compass, 
  Accessibility, 
  Navigation,
  Route,
  Clock
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const InteractiveStadiumTwin = dynamic(
  () => import("@/components/ui/InteractiveStadiumTwin"),
  {
    ssr: false,
    loading: () => <div className="h-[400px] bg-white/5 animate-pulse rounded-lg border border-white/5 flex items-center justify-center text-xs text-muted-foreground">Loading Interactive Stadium Twin...</div>
  }
);

export default function NavigationPage() {
  const { 
    activeScenario, 
    triggerSimulationScenario,
    wheelchairRoutes,
    setWheelchairRoutes
  } = useApp();

  const [fromPoint, setFromPoint] = useState("Transit Hub (Metro)");
  const [toSection, setToSection] = useState("Section 104 (East stand)");
  const [calculating, setCalculating] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState<{
    distanceM: number;
    timeMins: number;
    steps: string[];
    carbonSavedG: number;
  } | null>(null);

  const startPoints = [
    "Transit Hub (Metro)",
    "Parking Zone Green (East)",
    "Parking Zone Red (North)",
    "Gate B (Main Intake)",
    "Gate C (South Intake)",
  ];

  const destinationPoints = [
    "Section 104 (East stand)",
    "Section 114 (Concourse South)",
    "Section 202 (Upper Tier)",
    "Concourse Food Hall (North)",
    "First Aid Hub (Section 108)",
  ];

  const handleCalculateRoute = () => {
    setCalculating(true);
    setCalculatedRoute(null);

    // Simulate calculation loader
    setTimeout(() => {
      setCalculating(false);
      
      const isWheelchair = wheelchairRoutes;
      
      let steps = [];
      let time = 8;
      let distance = 420;

      if (fromPoint.includes("Metro")) {
        if (toSection.includes("104")) {
          if (isWheelchair) {
            steps = [
              "Depart Metro Station Platform West towards the accessible ramp pathway.",
              "Follow ADA Blue Line markers along the flat surface pathway past Ticket Checkpoint 1.",
              "Head directly to **ADA Gate 1** (Avoid Gate A which has stairways).",
              "Enter and board **Elevator Lobby E1** (ADA Priority Clearance active).",
              "Descend at Level 1, turn left, Section 104 accessible seating row is 20 meters ahead."
            ];
            time = 11;
            distance = 490;
          } else {
            steps = [
              "Depart Metro Station Platform West and proceed through Ticket Checkpoint 1.",
              "Walk along the main paved promenade past the World Cup Mascot zone.",
              "Enter through **Gate B (East Entrance)** (Clearance queue time: ~2 mins).",
              "Take the escalator directly behind the turnstiles to Concourse Level 1.",
              "Proceed left, pass Section 102. Section 104 entrance tunnel is on your left."
            ];
            time = 7;
            distance = 410;
          }
        } else if (toSection.includes("202")) {
          steps = [
            "Depart Metro Station Platform West towards Ticket Checkpoint 1.",
            "Enter via Gate D (West). Queue clearance: ~5 mins.",
            "Take Elevator Lobby E2 directly to Level 2 (Upper Tier).",
            "Follow concourse signage right, Section 202 is located directly adjacent to food court N3."
          ];
          time = 14;
          distance = 620;
        } else {
          steps = [
            "Proceed from current start point towards Section 114 entrance corridors.",
            "Pass through the main security scanner grid.",
            "Follow green route indicators along Concourse Level 1."
          ];
          time = 9;
          distance = 480;
        }
      } else if (fromPoint.includes("Parking Zone Green")) {
        steps = [
          "Exit Parking Lot Green Zone 4 through the pedestrian walkway.",
          "Head towards Gate B (East Entrance).",
          "Enter through the turnstiles, take the concourse steps or ramp to Section 104/114."
        ];
        time = 5;
        distance = 280;
      } else {
        steps = [
          "Depart from selected parking grid.",
          "Proceed to the nearest open gate interface.",
          "Follow section routing guides on visual signs."
        ];
        time = 10;
        distance = 500;
      }

      // Evacuation modification
      if (activeScenario === "evacuation") {
        steps = [
          "⚠️ **EMERGENCY ESCAPE ROUTING ACTIVE**",
          "Immediately locate the green illuminated exit arrows overhead.",
          "Move calmly to the nearest boundary portal (Gate B/D). Do not use elevators.",
          "Obey commands of Security Officers stationed along the stairways.",
          "Once outside, proceed past the ticket scan line to the open parking plazas."
        ];
        time = 4;
        distance = 310;
      }

      setCalculatedRoute({
        distanceM: distance,
        timeMins: time,
        steps: steps,
        carbonSavedG: fromPoint.includes("Metro") ? 180 : 0
      });
    }, 1200);
  };

  const handleScenarioChange = (scenario: StadiumScenario) => {
    triggerSimulationScenario(scenario);
    // Auto recalculate if route exists
    if (calculatedRoute) {
      setTimeout(() => handleCalculateRoute(), 100);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-purple-400" />
          Smart Navigation Planner
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Dual-mode GPS navigation and interior route calculator</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Side: Route inputs and direction panels */}
        <div className="xl:col-span-1 space-y-6">
          <GlassCard className="p-5" glow>
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-purple-400" />
              Route Planner
            </h3>

            <div className="space-y-4">
              {/* Start Point */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start Position</label>
                <select
                  value={fromPoint}
                  onChange={(e) => setFromPoint(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                >
                  {startPoints.map(sp => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              {/* End Point */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Destination</label>
                <select
                  value={toSection}
                  onChange={(e) => setToSection(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                >
                  {destinationPoints.map(dp => (
                    <option key={dp} value={dp}>{dp}</option>
                  ))}
                </select>
              </div>

              {/* Accessibility Route Selector Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">Wheelchair Route</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">Ramps, elevators, flat paths</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={wheelchairRoutes}
                  onChange={(e) => setWheelchairRoutes(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculateRoute}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                disabled={calculating}
              >
                {calculating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Calculating AI Route...
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    Calculate Best AI Route
                  </>
                )}
              </button>
            </div>
          </GlassCard>

          {/* Calculated Route Panel */}
          {calculatedRoute && (
            <GlassCard className="p-5 space-y-4" glow>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">AI Direction Guide</h4>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1 text-purple-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {calculatedRoute.timeMins}m
                  </span>
                  <span className="text-muted-foreground font-semibold">
                    {calculatedRoute.distanceM}m
                  </span>
                </div>
              </div>

              {/* Eco tip */}
              {calculatedRoute.carbonSavedG > 0 && (
                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
                  🌱 Saves {calculatedRoute.carbonSavedG}g of CO2 vs private car trip!
                </div>
              )}

              {/* Navigation timeline */}
              <div className="space-y-3">
                {calculatedRoute.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs items-start">
                    <span className="w-4 h-4 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-400 flex items-center justify-center shrink-0 font-extrabold mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-gray-200 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Quick Simulation controls panel */}
          <GlassCard className="p-5 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Simulation Sandbox</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Trigger events to test route adaptation</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                onClick={() => handleScenarioChange(activeScenario === "gate_closure" ? "none" : "gate_closure")}
                className={`p-2 rounded border font-semibold text-center transition cursor-pointer ${activeScenario === "gate_closure" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/5 hover:bg-white/5 text-gray-300"}`}
              >
                Gate A Closure
              </button>
              <button
                onClick={() => handleScenarioChange(activeScenario === "medical_emergency" ? "none" : "medical_emergency")}
                className={`p-2 rounded border font-semibold text-center transition cursor-pointer ${activeScenario === "medical_emergency" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/5 hover:bg-white/5 text-gray-300"}`}
              >
                Medical Alert
              </button>
              <button
                onClick={() => handleScenarioChange(activeScenario === "heavy_rain" ? "none" : "heavy_rain")}
                className={`p-2 rounded border font-semibold text-center transition cursor-pointer ${activeScenario === "heavy_rain" ? "bg-red-500/20 border-red-500 text-red-300" : "border-white/5 hover:bg-white/5 text-gray-300"}`}
              >
                Heavy Rain
              </button>
              <button
                onClick={() => handleScenarioChange(activeScenario === "evacuation" ? "none" : "evacuation")}
                className={`p-2 rounded border font-semibold text-center transition cursor-pointer ${activeScenario === "evacuation" ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse" : "border-white/5 hover:bg-white/5 text-gray-300"}`}
              >
                Evac Protocol
              </button>
            </div>
            {activeScenario !== "none" && (
              <button
                onClick={() => handleScenarioChange("none")}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded transition cursor-pointer"
              >
                Reset Map Conditions
              </button>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Digital Stadium Twin map */}
        <div className="xl:col-span-3">
          <InteractiveStadiumTwin />
        </div>

      </div>

    </div>
  );
}
