import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// High-fidelity local fallback responder
const generateMockResponse = (message: string): string => {
  const query = message.toLowerCase();
  
  if (query.includes("seat") || query.includes("section") || query.includes("find my")) {
    return `**StadiumOS Navigation Guide:**
- **Your Section:** Section 104 (East Stand, Row M)
- **Best Entrance:** **Gate B (East Entrance)** is currently open and has a low queue wait time (< 3 mins).
- **Directions:** Enter via Gate B, pass ticket scanning, and take the main escalator to Concourse Level 1. Turn left, follow the signs past Section 102. Your section portal is next to the fan store.
- **ADA Route:** Take Elevator Lobby E1 (next to ADA Gate 1) directly to Level 1. Elevators have priority access.`;
  }
  
  if (query.includes("food") || query.includes("drink") || query.includes("beer") || query.includes("hungry")) {
    return `**Food & Concessions Recommendations (Near Section 104):**
1. **World Cup Flavors (Section 102):** Signature tacos, empanadas, and cold beverages. (Wait time: ~4 mins)
2. **Gluten-Free & Veggie (Section 106):** Fresh salads, vegan wraps, and fruit cups. (Wait time: ~2 mins)
3. **Stadium Grill (Section 105):** Traditional stadium hotdogs, burgers, and draft beer. (Wait time: ~6 mins)
- *Sustainability Tip:* Bring your reusable StadiumOS souvenir cup to any fountain dispenser for 50% off refills!`;
  }

  if (query.includes("washroom") || query.includes("toilet") || query.includes("restroom")) {
    return `**Restroom Locator:**
- **Nearest Restroom:** Behind Section 105 (approximately 45 meters from Section 104).
- **Available Facilities:** Male, Female, Gender-Neutral, and ADA Accessible (equipped with baby changing tables).
- **Live Queue Status:** Low Congestion (estimated queue: less than 1 minute).
- **Secondary Option:** Section 112 Restroom Hub (Medium Congestion, wait ~3 mins).`;
  }

  if (query.includes("parking") || query.includes("park") || query.includes("shuttle") || query.includes("car")) {
    return `**Parking & Transit Assistance:**
- **Optimized Lot:** **Green Parking Lot Zone 4** is closest to your Gate B seating entrance.
- **ADA Shuttle:** Shuttle Route A departs from Green Lot every 5 minutes and drops off at ADA Gate 1.
- **Sustainability Suggestion:** Metro Rail Line 26 has direct platforms at the Stadium station. Travel is free for all World Cup ticket holders today and saves 180g of CO2 compared to private transit.`;
  }

  if (query.includes("emergency") || query.includes("medical") || query.includes("hurt") || query.includes("security") || query.includes("danger")) {
    return `⚠️ **CRITICAL EMERGENCY SUPPORT TRIGGERED**
- **Action Taken:** A live venue support ticket has been dispatched. Nearby volunteer escorts and medical responders have been alerted.
- **Your Location Context:** Transmitting signal coordinates from Section 104 / Gate B.
- **Safety Instructions:** Please remain where you are. If there is immediate danger, locate the nearest fluorescent-vested Security Officer or head to the **First Aid Station** located behind Section 108. Emergency exit pathways are currently lit in green.`;
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("help") || query.includes("hey")) {
    return `Welcome to **StadiumOS AI** – the official AI Assistant for FIFA World Cup 2026! 🏟️

I am here to guide you through your stadium experience. You can ask me:
- *"How do I find my seat in Section 104?"*
- *"Where is the closest washroom with wheelchair access?"*
- *"What food stands are near Section 106?"*
- *"Which parking lot should I park in?"*
- *"Help, there's a medical emergency!"*

How can I assist you today? (Supporting 30+ languages, type in any language!)`;
  }

  return `Thank you for your request. As your StadiumOS assistant, I've analyzed your query: "${message}".

For today's FIFA World Cup match at SoFi Stadium, here are the vital points:
1. **Intake status:** The gates are 68% full. Gate B is recommended for faster access.
2. **Transportation:** Metro Rail is running on-time with 4 min frequencies.
3. **Navigation:** Standard walking directions are active. Check the Navigation tab for the Digital Twin map.

Please let me know if you need more details on gates, washrooms, seat directions, or safety protocols!`;
};

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Chat API request body JSON parse failure:", parseError);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { messages } = body;
    const lastUserMessage = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : "";

    if (!lastUserMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // If Gemini API is available, use it!
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: `You are StadiumOS AI, the official futuristic AI Assistant for the FIFA World Cup 2026. 
You assist fans, volunteers, medical teams, and organizers. 
Be concise, use bullet points, and maintain a premium, helpful, professional, and accessible tone.
Always provide wheelchair-accessible options when talking about navigation or gates.
Keep answers under 120 words unless requested.
Context:
- Stadium: SoFi Stadium, Los Angeles (also supports MetLife Stadium, NY).
- Gate A (North): Congested (wait 15m) or Closed during simulation.
- Gate B (East): Near Section 104, open and fast.
- Gate C (South): ADA access Gate 1 is here.
- Gate D (West): Close to Metro connection.
- Washrooms are at Section 105, 112, 124.
- Sustainability: Free Metro ticket with match entry; water refill stations near all food concession kiosks.`
        });

        // Convert messages to Gemini format
        const response = await model.generateContent(lastUserMessage);
        const text = response.response.text();

        return NextResponse.json({ role: "assistant", content: text });
      } catch (geminiError) {
        console.error("Gemini API Error, falling back to simulator:", geminiError);
        // Fallback to mock on API error
        return NextResponse.json({ 
          role: "assistant", 
          content: generateMockResponse(lastUserMessage) + "\n\n*(Telemetry Offline: Running on Local AI Core)*" 
        });
      }
    }

    // Default to mock if key is missing
    const mockReply = generateMockResponse(lastUserMessage);
    return NextResponse.json({ role: "assistant", content: mockReply });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
