"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "fan" | "organizer" | "volunteer" | "security" | "medical" | "admin";
export type StadiumScenario = "none" | "gate_closure" | "medical_emergency" | "heavy_rain" | "evacuation";
export type GateStatus = "open" | "congested" | "closed";

export interface Incident {
  id: string;
  title: string;
  type: "security" | "medical" | "facility" | "crowd";
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  status: "reported" | "dispatching" | "resolved";
  volunteerAssigned?: string;
  timestamp: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  status: "idle" | "assigned" | "off-duty";
  currentTask?: string;
  assignedLocation?: string;
}

export interface TransitFeed {
  id: string;
  line: string;
  type: "metro" | "bus" | "shuttle";
  status: "on-time" | "delayed" | "suspended";
  load: "low" | "medium" | "heavy";
  etaMinutes: number;
  carbonSavedG: number;
}

interface AppContextProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeStadium: string;
  setActiveStadium: (stadium: string) => void;
  
  // Accessibility state
  voiceNavigation: boolean;
  setVoiceNavigation: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  wheelchairRoutes: boolean;
  setWheelchairRoutes: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;

  // Simulator state
  activeScenario: StadiumScenario;
  triggerSimulationScenario: (scenario: StadiumScenario) => void;
  crowdLevel: number;
  setCrowdLevel: (level: number) => void;
  gateStatuses: Record<string, GateStatus>;
  setGateStatus: (gate: string, status: GateStatus) => void;
  
  // Live Telemetry
  stadiumHealth: number;
  setStadiumHealth: (val: number) => void;
  crowdRisk: number;
  setCrowdRisk: (val: number) => void;
  aiConfidence: number;
  
  // Incidents state
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, "id" | "timestamp">) => void;
  resolveIncident: (id: string) => void;
  assignVolunteer: (incidentId: string, volunteerId: string) => void;

  // Volunteers state
  volunteers: Volunteer[];
  updateVolunteerStatus: (id: string, status: Volunteer["status"], task?: string, location?: string) => void;

  // Transit state
  transitFeeds: TransitFeed[];
  updateTransitStatus: (id: string, status: TransitFeed["status"], load: TransitFeed["load"]) => void;

  // Judge Demo Tour Mode
  isTourActive: boolean;
  setIsTourActive: (val: boolean) => void;
  tourStep: number;
  setTourStep: (val: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  exitTour: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>("fan");
  const [activeStadium, setActiveStadium] = useState<string>("SoFi Stadium, LA");

  // Accessibility State
  const [voiceNavigation, setVoiceNavigation] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [wheelchairRoutes, setWheelchairRoutes] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Live Telemetry
  const [stadiumHealth, setStadiumHealth] = useState(98);
  const [crowdRisk, setCrowdRisk] = useState(12);
  const [aiConfidence, setAiConfidence] = useState(99);

  // Simulation State
  const [activeScenario, setActiveScenario] = useState<StadiumScenario>("none");
  const [crowdLevel, setCrowdLevel] = useState(0.68);
  const [gateStatuses, setGateStatuses] = useState<Record<string, GateStatus>>({
    "Gate A (North)": "open",
    "Gate B (East)": "open",
    "Gate C (South)": "open",
    "Gate D (West)": "open",
    "ADA Gate 1": "open",
  });

  // Guided Tour state
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Incidents list
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-101",
      title: "Heat Exhaustion at Gate B",
      type: "medical",
      location: "Gate B (East)",
      severity: "high",
      description: "Fan experiencing dizziness and dehydration due to heat. Requires medical responder.",
      status: "reported",
      timestamp: "22:15",
    },
    {
      id: "INC-102",
      title: "Queue Overflow Gate A",
      type: "crowd",
      location: "Gate A (North)",
      severity: "medium",
      description: "Turnstile scanner malfunctioning causing bottleneck. Over 200 fans queued outside.",
      status: "dispatching",
      volunteerAssigned: "Sarah Jenkins",
      timestamp: "22:20",
    },
    {
      id: "INC-103",
      title: "Spilled Drink Slip Hazard",
      type: "facility",
      location: "Section 114 concourse",
      severity: "low",
      description: "Large liquid spill near the food concession. Requiring janitorial service.",
      status: "resolved",
      timestamp: "21:45",
    },
  ]);

  // Volunteers list
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: "VOL-01", name: "Sarah Jenkins", role: "Crowd Flow Assistant", status: "assigned", currentTask: "Crowd control at Gate A turnstiles", assignedLocation: "Gate A (North)" },
    { id: "VOL-02", name: "Carlos Menendez", role: "Multilingual Escort", status: "idle", assignedLocation: "Main Concourse" },
    { id: "VOL-03", name: "Yuki Tanaka", role: "Medical Aid Assistant", status: "idle", assignedLocation: "First Aid Station 1" },
    { id: "VOL-04", name: "David Kim", role: "ADA Support Agent", status: "idle", assignedLocation: "ADA Gate 1" },
    { id: "VOL-05", name: "Fatima Al-Sayed", role: "Sustainability Guide", status: "off-duty" },
  ]);

  // Transit channels
  const [transitFeeds, setTransitFeeds] = useState<TransitFeed[]>([
    { id: "TR-01", line: "Metro Rail Line 26", type: "metro", status: "on-time", load: "heavy", etaMinutes: 4, carbonSavedG: 180 },
    { id: "TR-02", line: "Stadium Shuttle East", type: "shuttle", status: "on-time", load: "medium", etaMinutes: 6, carbonSavedG: 120 },
    { id: "TR-03", line: "Metro Shuttle Express", type: "shuttle", status: "delayed", load: "heavy", etaMinutes: 14, carbonSavedG: 120 },
    { id: "TR-04", line: "Tournament Bus Route 4", type: "bus", status: "on-time", load: "low", etaMinutes: 9, carbonSavedG: 95 },
  ]);

  // Sync body tags for accessibility
  useEffect(() => {
    const body = document.body;
    if (highContrast) body.classList.add("high-contrast");
    else body.classList.remove("high-contrast");
  }, [highContrast]);

  useEffect(() => {
    const body = document.body;
    if (largeText) body.classList.add("large-text");
    else body.classList.remove("large-text");
  }, [largeText]);

  // Dynamic telemetry update loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Do not shift values during active evacuation scenario or tour
      if (activeScenario === "evacuation" || isTourActive) return;

      setStadiumHealth((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next > 100 ? 100 : next < 85 ? 85 : next;
      });

      setCrowdRisk((prev) => {
        const activeCount = incidents.filter(i => i.status !== "resolved").length;
        const targetRisk = activeCount * 8 + (activeScenario !== "none" ? 25 : 5);
        const change = prev < targetRisk ? 1 : prev > targetRisk ? -1 : 0;
        return prev + change;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [incidents, activeScenario, isTourActive]);

  // Handle simulated scenarios
  const triggerSimulationScenario = (scenario: StadiumScenario) => {
    setActiveScenario(scenario);
    if (scenario === "none") {
      setCrowdLevel(0.68);
      setStadiumHealth(98);
      setCrowdRisk(12);
      setGateStatuses({
        "Gate A (North)": "open",
        "Gate B (East)": "open",
        "Gate C (South)": "open",
        "Gate D (West)": "open",
        "ADA Gate 1": "open",
      });
    } else if (scenario === "gate_closure") {
      setStadiumHealth(88);
      setCrowdRisk(48);
      setGateStatuses((prev) => ({
        ...prev,
        "Gate A (North)": "closed",
        "Gate B (East)": "congested",
      }));
      addIncident({
        title: "Gate A Structural Closure",
        type: "facility",
        location: "Gate A (North)",
        severity: "high",
        description: "Gate A closed due to localized power outage. Rerouting traffic to Gate B.",
        status: "reported",
      });
    } else if (scenario === "medical_emergency") {
      setStadiumHealth(92);
      setCrowdRisk(32);
      addIncident({
        title: "Spectator Collapse Section 202",
        type: "medical",
        location: "Section 202 Row G",
        severity: "critical",
        description: "Possible cardiac incident reported in upper tier. CPR/AED team dispatched.",
        status: "reported",
      });
    } else if (scenario === "heavy_rain") {
      setStadiumHealth(90);
      setCrowdRisk(28);
      setCrowdLevel(0.85);
      setGateStatuses((prev) => ({
        ...prev,
        "Gate B (East)": "congested",
        "Gate C (South)": "congested",
      }));
      addIncident({
        title: "Indoor Concourse Overcrowding",
        type: "crowd",
        location: "Main Concourse Area",
        severity: "high",
        description: "Fans seeking shelter from storm bottlenecking primary concessions walk.",
        status: "reported",
      });
    } else if (scenario === "evacuation") {
      setStadiumHealth(45);
      setCrowdRisk(96);
      setCrowdLevel(1.0);
      setGateStatuses({
        "Gate A (North)": "open",
        "Gate B (East)": "open",
        "Gate C (South)": "open",
        "Gate D (West)": "open",
        "ADA Gate 1": "open",
      });
      addIncident({
        title: "PRECAUTIONARY EVACUATION STAGE 1",
        type: "security",
        location: "Entire Stadium",
        severity: "critical",
        description: "Organizers issued evacuation directive. Directing fans to nearest exit gateways.",
        status: "reported",
      });
    }
  };

  const setGateStatus = (gate: string, status: GateStatus) => {
    setGateStatuses((prev) => ({ ...prev, [gate]: status }));
  };

  const addIncident = (incidentData: Omit<Incident, "id" | "timestamp">) => {
    const newInc: Incident = {
      ...incidentData,
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setIncidents((prev) => [newInc, ...prev]);
  };

  const resolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "resolved" } : inc))
    );
  };

  const assignVolunteer = (incidentId: string, volunteerId: string) => {
    const volName = volunteers.find((v) => v.id === volunteerId)?.name || "Volunteer";
    
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              status: "assigned",
              currentTask: `Assigned to incident ${incidentId}`,
            }
          : v
      )
    );

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "dispatching",
              volunteerAssigned: volName,
            }
          : inc
      )
    );
  };

  const updateVolunteerStatus = (id: string, status: Volunteer["status"], task?: string, location?: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status, currentTask: task, assignedLocation: location } : v))
    );
  };

  const updateTransitStatus = (id: string, status: TransitFeed["status"], load: TransitFeed["load"]) => {
    setTransitFeeds((prev) =>
      prev.map((tr) => (tr.id === id ? { ...tr, status, load } : tr))
    );
  };

  // Tour transitions logic
  const nextTourStep = () => {
    setTourStep((prev) => {
      const nextStep = prev + 1;
      applyTourSideEffects(nextStep);
      return nextStep;
    });
  };

  const prevTourStep = () => {
    setTourStep((prev) => {
      const nextStep = Math.max(1, prev - 1);
      applyTourSideEffects(nextStep);
      return nextStep;
    });
  };

  const exitTour = () => {
    setIsTourActive(false);
    setTourStep(0);
    setUserRole("fan");
    triggerSimulationScenario("none");
  };

  const applyTourSideEffects = (step: number) => {
    switch (step) {
      case 1: // Fan
        setUserRole("fan");
        break;
      case 2: // Chat Assistant
        setUserRole("fan");
        break;
      case 3: // Stadium Twin
        setUserRole("organizer");
        setWheelchairRoutes(false);
        break;
      case 4: // Predictions
        setUserRole("organizer");
        break;
      case 5: // Volunteer Optimizer
        setUserRole("volunteer");
        break;
      case 6: // Emergency Simulation
        setUserRole("security");
        triggerSimulationScenario("gate_closure");
        break;
      case 7: // Executive Report
        setUserRole("organizer");
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeStadium,
        setActiveStadium,
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
        activeScenario,
        triggerSimulationScenario,
        crowdLevel,
        setCrowdLevel,
        gateStatuses,
        setGateStatus,
        stadiumHealth,
        setStadiumHealth,
        crowdRisk,
        setCrowdRisk,
        aiConfidence,
        incidents,
        addIncident,
        resolveIncident,
        assignVolunteer,
        volunteers,
        updateVolunteerStatus,
        transitFeeds,
        updateTransitStatus,
        isTourActive,
        setIsTourActive,
        tourStep,
        setTourStep,
        nextTourStep,
        prevTourStep,
        exitTour,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
