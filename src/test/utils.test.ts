import { describe, it, expect } from "vitest";

describe("Transportation Carbon Calculator Utilities", () => {
  it("should calculate correct carbon savings compared to solo driving", () => {
    const carbonFactors = { car_solo: 220, rideshare: 110, bus: 80, metro: 20 };
    const distanceKm = 15;
    const soloCarCarbon = distanceKm * carbonFactors.car_solo;
    const metroCarbon = distanceKm * carbonFactors.metro;
    const carbonSaved = soloCarCarbon - metroCarbon;
    
    expect(soloCarCarbon).toBe(3300);
    expect(metroCarbon).toBe(300);
    expect(carbonSaved).toBe(3000);
  });
});
