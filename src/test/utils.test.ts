import { describe, it, expect } from "vitest";
import { calculateCarbonSavings } from "@/utils/transit";

describe("Transportation Carbon Calculator Utilities", () => {
  it("should calculate correct carbon savings compared to solo driving", () => {
    const { soloCarCarbon, selectedCarbon, carbonSaved } = calculateCarbonSavings(15, "metro");
    
    expect(soloCarCarbon).toBe(3300);
    expect(selectedCarbon).toBe(300);
    expect(carbonSaved).toBe(3000);
  });
});
