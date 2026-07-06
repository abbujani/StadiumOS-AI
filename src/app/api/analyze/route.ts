import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Local analytics fallback for Command queries
const runLocalCommand = (query: string, gateStatuses: any, incidents: any[]): string => {
  const q = query.toLowerCase();
  
  if (q.includes("crowd") || q.includes("gate") || q.includes("congested")) {
    const congestedGates = Object.entries(gateStatuses)
      .filter(([_, status]) => status === "congested" || status === "closed")
      .map(([name, status]) => `**${name}** (${status})`);
      
    if (congestedGates.length === 0) {
      return `### Crowd & Gate Intake Summary
- **Current Status:** All gates are running smoothly at normal capacities.
- **Recommendations:** Intake flow is balanced. No redirections needed.`;
    }
    
    return `### Live Gate Congestion Report
- **Alert:** The following entry points are experiencing bottlenecks: ${congestedGates.join(", ")}.
- **Primary Bottleneck:** **Gate A (North)** is experiencing turnstile hardware delays. Wait times are currently estimated at 22 minutes.
- **AI Recommendation:** Immediately redirect outer perimeter queues approaching from the North Parking area to **Gate D (West)**. Dispatch 2 crowd flow volunteers to the Gate A queue line to handle manual ticket validation.`;
  }
  
  if (q.includes("evacuat") || q.includes("strategy") || q.includes("safety")) {
    return `### Optimized Evacuation Strategy
- **Trigger Level:** Emergency Phase 1 (Precautionary evacuation).
- **Egress Routing:**
  - **Sections 100-112:** Evacuate Eastward through **Gate B**.
  - **Sections 114-130:** Evacuate Westward through **Gate D**.
  - **Upper Tiers (200+):** Evacuate via elevator bays E1/E2 and main stairwells.
- **Priority Operations:** Lock all entry turnstiles. Activate emergency green directional lights. Elevators are locked in shuttle-mode for wheelchair/ADA patrons only.`;
  }

  if (q.includes("summar") || q.includes("operations") || q.includes("status")) {
    const activeIncidents = incidents.filter(i => i.status !== "resolved").length;
    return `### Stadium Operations Briefing
- **Attendance:** 68,401 / 70,000 (97.7% seating occupancy).
- **Incident Summary:** **${activeIncidents} active tickets** are registered. 1 High Severity medical case (Heat stroke at Gate B) and 1 Medium Severity crowd bottleneck (Gate A).
- **Transit Feeds:** Metro rail operating at 100% capacity with 4 min intervals. Bus networks delayed 8 mins due to local road traffic.
- **Sustainability Score:** 84/100. Carbon footprint reduced by 22% due to high public transport usage (61% of total attendees arrived via transit).`;
  }

  return `### Command Center Query Result
Analyzed query: "${query}" against live telemetry feeds.
- **Systems Status:** Nominal
- **Crowd Load:** 68%
- **Security Alert Status:** Amber (Low Risk)
*AI Command Suggestion:* For detailed questions about gates, transit, or security tickets, try terms like "gate congestion", "evacuation strategy", or "operation summary".`;
};

// Local executive summary generator
const generateExecutiveSummary = (gateStatuses: any, incidents: any[], activeScenario: string, crowdLevel: number): string => {
  const activeInc = incidents.filter(i => i.status !== "resolved");
  const medicalCount = activeInc.filter(i => i.type === "medical").length;
  const securityCount = activeInc.filter(i => i.type === "security").length;
  const crowdCount = activeInc.filter(i => i.type === "crowd").length;

  return `**StadiumOS Executive Operations Summary**
*Generated: FIFA World Cup 2026 Operations Command*

1. **Crowd Intelligence:**
   - Seating Occupancy is currently at **${(crowdLevel * 100).toFixed(0)}%**.
   - Gate A is **${gateStatuses["Gate A (North)"] || "open"}**, Gate B is **${gateStatuses["Gate B (East)"] || "open"}**. 
   - Intake flows are peak-loaded. Commute queues are steady.

2. **Security & Medical Dispatch:**
   - **${activeInc.length} Active Incidents** detected.
   - **Medical:** ${medicalCount} active incident(s) - including a heat stroke case under responder dispatch.
   - **Security:** ${securityCount} active threat indicators - low risk.
   - **Crowds:** ${crowdCount} queue bottlenecks under queue control.

3. **Transit & Logistics:**
   - Metro Rail Line 26 is on-time. Shuttle services are running with high dispatch frequencies.
   - Traffic speeds around the stadium perimeter average 18 mph.

4. **Sustainability Performance:**
   - Eco-Score: **86/100 (Excellent)**.
   - Energy grid draws 42% from solar arrays.
   - Solid waste diversion rate is 78%, supported by green recycling volunteers.

5. **AI Operational Outlook:**
   - System advises maintaining active transit dispatch. If simulated rain starts, prepare immediate concourse canopy shields.`;
};

// Local emergency plan generator
const generateEmergencyPlan = (scenario: string): string => {
  if (scenario === "gate_closure") {
    return `### Emergency Response Plan: Gate Intake Blockade
- **Threat Level:** Medium Risk (Risk Index: 5.8)
- **Primary Issue:** Structural gate closing or queue gridlock.
- **Mandated Operations:**
  1. Set approach road signage to "Gate A CLOSED - Use Gate B/D".
  2. Reassign 3 volunteer guides to perimeter pathways to steer fans away.
  3. Increase turnstile throughput speed at Gate B by deploying manual scanner backup.`;
  }
  
  if (scenario === "medical_emergency") {
    return `### Emergency Response Plan: Cardiac / Major Medical Incident
- **Threat Level:** High Risk (Risk Index: 8.2)
- **Primary Issue:** Spectator collapse requiring defibrillator.
- **Mandated Operations:**
  1. Dispatch CPR Certified Medical Team A (Zone 2) via elevator bay 3.
  2. Station Volunteer Yuki Tanaka at Section 202 entry portal to direct EMTs.
  3. Notify Arena Operations to yield lift priority to Emergency Services.`;
  }
  
  if (scenario === "evacuation") {
    return `### CRITICAL EVACUATION PROTOCOL
- **Threat Level:** Critical Risk (Risk Index: 9.9)
- **Primary Issue:** Stadium-wide evacuation directive.
- **Mandated Operations:**
  1. Sound fire/safety klaxons. Trigger voice broadcast in English, Spanish, French.
  2. Open all exit gates (Gates A-D) and lift all ADA ramp gates.
  3. Switch digital screens to show green arrows pointing to the nearest gate exits.
  4. Dispatch Security teams to clear concourse bottlenecks.`;
  }
  
  return `### Operations Protocol: Standard Safety Check
- **Threat Level:** Low Risk (Risk Index: 1.0)
- **Primary Issue:** None
- **Mandated Operations:** Maintain standard security patrols and continuous CCTV analytics monitoring.`;
};

export async function POST(request: Request) {
  try {
    const { type, query, gateStatuses = {}, incidents = [], activeScenario = "none", crowdLevel = 0.68 } = await request.json();

    // If Gemini API is available, use it!
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: "You are the StadiumOS AI Command Core, analyzing stadium telemetry for organizers. Provide professional, data-driven, and highly structured responses. Use bullet points and clean markdown. Avoid fluff."
        });

        let prompt = "";
        if (type === "command") {
          prompt = `Run command analysis for organizers: "${query}".
          Live Telemetry Context:
          - Gate statuses: ${JSON.stringify(gateStatuses)}
          - Active incidents list: ${JSON.stringify(incidents)}
          - Active scenario: ${activeScenario}
          - Crowd Level: ${crowdLevel}
          Provide a direct answer, risk index, and concrete action steps.`;
        } else if (type === "summary") {
          prompt = `Generate an Executive Operations Summary for the FIFA World Cup organizers.
          Live Telemetry Context:
          - Seating occupancy: ${crowdLevel * 100}%
          - Gate statuses: ${JSON.stringify(gateStatuses)}
          - Incidents list: ${JSON.stringify(incidents)}
          - Active scenario: ${activeScenario}
          Provide a summary covering: Crowd status, Security & Medical dispatch, Transportation, and Sustainability. Include an overall AI Operational Recommendation.`;
        } else if (type === "emergency") {
          prompt = `Generate an Emergency Response Decision Plan for the stadium scenario: "${activeScenario}".
          Provide: Risk level indicator (1-10), key danger spots on the map, and a 4-step emergency dispatcher checklist.`;
        } else {
          prompt = "Provide a general operational system check status report.";
        }

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        return NextResponse.json({ result: text });

      } catch (geminiError) {
        console.error("Gemini API Error in analyze endpoint, falling back:", geminiError);
        // Fallback to local engines on API error
      }
    }

    // Default local parser logic
    let result = "";
    if (type === "command") {
      result = runLocalCommand(query || "", gateStatuses, incidents);
    } else if (type === "summary") {
      result = generateExecutiveSummary(gateStatuses, incidents, activeScenario, crowdLevel);
    } else if (type === "emergency") {
      result = generateEmergencyPlan(activeScenario);
    } else {
      result = "StadiumOS AI Command Core: System Nominal. No errors detected.";
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error("API Route Error in analyze:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
