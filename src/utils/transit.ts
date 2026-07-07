export const CARBON_FACTORS: Record<string, number> = {
  car_solo: 220,
  rideshare: 110,
  bus: 80,
  metro: 20
};

export interface CarbonSavingsResult {
  soloCarCarbon: number;
  selectedCarbon: number;
  carbonSaved: number;
}

/**
 * Calculates carbon savings comparing solo car driving to other public transit selections.
 * @param distanceKm Distance travelled in kilometers
 * @param selectedTransit Key of chosen transit type (metro, bus, rideshare)
 */
export const calculateCarbonSavings = (distanceKm: number, selectedTransit: string): CarbonSavingsResult => {
  const soloCarCarbon = distanceKm * CARBON_FACTORS["car_solo"];
  const selectedCarbon = distanceKm * (CARBON_FACTORS[selectedTransit] ?? 0);
  const carbonSaved = soloCarCarbon - selectedCarbon;
  
  return { soloCarCarbon, selectedCarbon, carbonSaved };
};
