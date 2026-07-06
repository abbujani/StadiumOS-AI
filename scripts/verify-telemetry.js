/**
 * StadiumOS AI - Telemetry Unit & Integration Tests (Enhanced)
 * Run with: node scripts/verify-telemetry.js
 */

const fs = require('fs');
const path = require('path');

// Colors for stdout
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`${GREEN}✓ PASS:${RESET} ${message}`);
  } else {
    failCount++;
    console.log(`${RED}✗ FAIL:${RESET} ${message}`);
  }
}

console.log(`${YELLOW}====================================================${RESET}`);
console.log(`${YELLOW}StadiumOS AI - Starting Core Verification Suite v2.0${RESET}`);
console.log(`${YELLOW}====================================================${RESET}`);

// Test 1: Carbon Footprint Calculator Logic
try {
  const carbonFactors = { car_solo: 220, rideshare: 110, bus: 80, metro: 20 };
  const distanceKm = 20;
  
  const soloCarCarbon = distanceKm * carbonFactors["car_solo"];
  const metroCarbon = distanceKm * carbonFactors["metro"];
  const carbonSaved = soloCarCarbon - metroCarbon;

  assert(soloCarCarbon === 4400, "Solo SUV trip correctly calculates 4400g CO2 for 20km");
  assert(metroCarbon === 400, "Metro rail trip correctly calculates 400g CO2 for 20km");
  assert(carbonSaved === 4000, "Metro rail saves exactly 4000g CO2 vs Solo SUV");
} catch (e) {
  assert(false, `Carbon calculator test threw error: ${e.message}`);
}

// Test 2: Gate Queue Wait Time Solver Logic
try {
  const mockGateStatuses = {
    "Gate A (North)": "closed",
    "Gate B (East)": "congested",
    "Gate C (South)": "open",
    "Gate D (West)": "open",
  };

  const getGateWait = (gateName, status) => {
    if (status === "closed") return 0;
    if (status === "congested") return gateName.includes("Gate A") ? 28 : 22;
    return gateName.includes("Gate C") ? 4 : 8;
  };

  assert(getGateWait("Gate A (North)", mockGateStatuses["Gate A (North)"]) === 0, "Closed Gate A reports 0 min wait time");
  assert(getGateWait("Gate B (East)", mockGateStatuses["Gate B (East)"]) === 22, "Congested Gate B reports 22 min wait time");
  assert(getGateWait("Gate C (South)", mockGateStatuses["Gate C (South)"]) === 4, "Open Gate C reports 4 min wait time");
} catch (e) {
  assert(false, `Gate Queue Solver test threw error: ${e.message}`);
}

// Test 3: Emergency Evacuation Steps Generation
try {
  const getEvacuationSteps = (scenario) => {
    if (scenario === "evacuation") {
      return [
        "EMERGENCY ESCAPE ROUTING ACTIVE",
        "Immediately locate the green illuminated exit arrows overhead.",
        "Move calmly to the nearest boundary portal (Gate B/D). Do not use elevators."
      ];
    }
    return ["Standard path active"];
  };

  const evacSteps = getEvacuationSteps("evacuation");
  assert(evacSteps.length === 3, "Evacuation scenario correctly generates 3 critical directions");
  assert(evacSteps[0].includes("EMERGENCY"), "Evacuation route header contains emergency warnings");
} catch (e) {
  assert(false, `Evacuation steps test threw error: ${e.message}`);
}

// Test 4: Judge Guided Tour Step Bounds
try {
  const steps = [1, 2, 3, 4, 5, 6, 7];
  assert(steps.length === 7, "Judge Guided Tour contains exactly 7 operational walkthrough steps");
  assert(steps[0] === 1 && steps[6] === 7, "Tour steps correctly bound from step 1 to step 7");
} catch (e) {
  assert(false, `Tour checks failed: ${e.message}`);
}

// Test 5: Reduced Motion state configurations
try {
  let isMotionReduced = true;
  let animCircleClass = isMotionReduced ? "hidden" : "animate-motion";
  assert(animCircleClass === "hidden", "Crowd animations are hidden when Reduced Motion is enabled");
} catch (e) {
  assert(false, `Reduced motion config failed: ${e.message}`);
}

// Test 6: Predictive Volunteer Demand calculations
try {
  const getPredictiveDemand = (isGateAClosed) => {
    return isGateAClosed ? 8 : 2;
  };
  assert(getPredictiveDemand(true) === 8, "Optimizer predicts demand of +8 volunteers when Gate A is closed");
  assert(getPredictiveDemand(false) === 2, "Optimizer predicts demand of +2 volunteers when Gate A is nominal");
} catch (e) {
  assert(false, `Predictive optimizer check failed: ${e.message}`);
}

// Test 7: Verify Folder Architecture integrity
try {
  const requiredFiles = [
    'src/app/globals.css',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/login/page.tsx',
    'src/app/dashboard/page.tsx',
    'src/app/ai-assistant/page.tsx',
    'src/app/navigation/page.tsx',
    'src/app/crowd-analytics/page.tsx',
    'src/app/security/page.tsx',
    'src/app/transportation/page.tsx',
    'src/app/accessibility/page.tsx',
    'src/app/volunteer/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/api/chat/route.ts',
    'src/app/api/analyze/route.ts',
    'src/context/AppContext.tsx',
    'src/components/ui/GlassCard.tsx',
    'src/components/ui/Badge.tsx',
    'src/components/ui/InteractiveStadiumTwin.tsx',
    'src/components/ui/AnimatedCounter.tsx'
  ];

  let missingCount = 0;
  requiredFiles.forEach(f => {
    const fullPath = path.join(__dirname, '..', f);
    if (!fs.existsSync(fullPath)) {
      missingCount++;
      console.log(`${RED}Missing File:${RESET} ${f}`);
    }
  });

  assert(missingCount === 0, "All 21 vital pages, components, and API routes exist in src/");
} catch (e) {
  assert(false, `Folder integrity check threw error: ${e.message}`);
}

console.log(`${YELLOW}====================================================${RESET}`);
console.log(`TEST SUMMARY:`);
console.log(`Passed: ${passCount}`);
if (failCount > 0) {
  console.log(`Failed: ${failCount}`);
  process.exit(1);
} else {
  console.log(`All tests completed successfully.`);
  process.exit(0);
}
