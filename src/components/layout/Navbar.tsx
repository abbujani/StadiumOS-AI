"use client";

import React, { useEffect } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { 
  Shield, 
  Volume2, 
  Type, 
  Eye, 
  Play,
  Sparkles,
  Calendar,
  XCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    userRole,
    setUserRole,
    voiceNavigation,
    setVoiceNavigation,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    activeScenario,
    isTourActive,
    setIsTourActive,
    setTourStep,
    tourStep,
    nextTourStep,
    prevTourStep,
    exitTour
  } = useApp();

  const rolesList: { name: string; value: UserRole }[] = [
    { name: "Fan", value: "fan" },
    { name: "Organizer", value: "organizer" },
    { name: "Volunteer", value: "volunteer" },
    { name: "Security Team", value: "security" },
    { name: "Medical Team", value: "medical" },
    { name: "System Admin", value: "admin" },
  ];

  const startTour = () => {
    setIsTourActive(true);
    setTourStep(1);
    router.push("/ai-assistant");
  };

  // Auto-advance guided tour routing side-effects
  useEffect(() => {
    if (!isTourActive) return;

    // Navigate to appropriate page corresponding to the tour step
    switch (tourStep) {
      case 1:
        router.push("/ai-assistant");
        break;
      case 2:
        router.push("/ai-assistant");
        break;
      case 3:
        router.push("/navigation");
        break;
      case 4:
        router.push("/crowd-analytics");
        break;
      case 5:
        router.push("/volunteer");
        break;
      case 6:
        router.push("/security");
        break;
      case 7:
        router.push("/dashboard");
        break;
      case 8:
        // Completed
        exitTour();
        router.push("/dashboard");
        break;
      default:
        break;
    }

    // Set auto-advance timer (8 seconds per step)
    const timer = setTimeout(() => {
      nextTourStep();
    }, 8500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTourActive, tourStep]);

  // Tour step descriptions
  const getTourStepText = () => {
    switch (tourStep) {
      case 1: return "Step 1: Fan Experience - Welcoming fans to the World Cup with live intake updates.";
      case 2: return "Step 2: AI Fan Assistant - Gemini handles seat queries, concessions, and ADA routes.";
      case 3: return "Step 3: Digital Stadium Twin - Vector overlays for Crowd, Evac, and wheelchair paths.";
      case 4: return "Step 4: Crowd Prediction - Area charts showing occupancy and wait forecasting.";
      case 5: return "Step 5: Volunteer Optimizer - Shifting staff dynamically to congested gates.";
      case 6: return "Step 6: Emergency Simulation - Active gate closures and AI emergency dispatch plans.";
      case 7: return "Step 7: Executive Summary - Compiled match brief report ready for PDF export.";
      default: return "";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <span className="text-white font-extrabold text-sm tracking-wider">⚽</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                StadiumOS <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xs font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">AI</span>
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">AI Operating System for FIFA World Cup 2026</p>
            </div>
          </Link>
        </div>

        {/* Telemetry Stats Bar or Tour Status */}
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
          {isTourActive ? (
            <div className="flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-lg text-purple-300 font-bold animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Guided Demo: Step {tourStep} of 7</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Tournament Day 24</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Intake: 68,401 / 70,000</span>
              </div>
            </>
          )}
          
          {activeScenario !== "none" && (
            <div className="flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/25 text-red-400 animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize font-bold">{activeScenario.replace("_", " ")} Mode</span>
            </div>
          )}
        </div>

        {/* Accessibilities and Roles Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Judge Demo Button */}
          {isTourActive ? (
            <button
              onClick={exitTour}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>End Tour</span>
            </button>
          ) : (
            <button
              onClick={startTour}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-black tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Judge Demo</span>
            </button>
          )}

          {/* Quick Accessibility Toggles */}
          <div className="flex items-center gap-1 px-1.5 py-1 glass-panel rounded-lg border-white/5">
            <button
              onClick={() => setVoiceNavigation(!voiceNavigation)}
              className={`p-1.5 rounded-md transition ${voiceNavigation ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-white"}`}
              title="Toggle Voice Navigation Assist"
              aria-label="Voice Navigation Assist"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1.5 rounded-md transition ${highContrast ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-white"}`}
              title="Toggle High Contrast Mode"
              aria-label="High Contrast Mode"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setLargeText(!largeText)}
              className={`p-1.5 rounded-md transition ${largeText ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:text-white"}`}
              title="Toggle Large Typography"
              aria-label="Large Typography Scale"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Role Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-semibold cursor-pointer outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 capitalize transition hover:bg-zinc-900"
                disabled={isTourActive}
              >
                {rolesList.map((role) => (
                  <option key={role.value} value={role.value} className="bg-zinc-950 text-white">
                    {role.name} Mode
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Guided Tour UI Banner (Fixed bottom) */}
      {isTourActive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90%] glass-panel-heavy p-4 rounded-xl border border-purple-500/30 flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <div className="space-y-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">FIFA 2026 Telemetry Tour</span>
            <p className="text-xs font-bold text-white">{getTourStepText()}</p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prevTourStep}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition cursor-pointer"
              disabled={tourStep === 1}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTourStep}
              className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
