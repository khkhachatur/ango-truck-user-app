export type TruckSize = 'S' | 'M' | 'L' | 'XL';

export interface TruckConfig {
  label: string;
  maxWeightKg: number;
  description: string;
  pricePerKmKz: number;
}

export const TRUCK_SIZES: Record<TruckSize, TruckConfig> = {
  S: {
    label: 'Pickup',
    maxWeightKg: 1_000,
    description: 'Ideal for quick city deliveries',
    pricePerKmKz: 150,
  },
  M: {
    label: 'Box Truck',
    maxWeightKg: 3_500,
    description: 'Standard for furniture and retail',
    pricePerKmKz: 350,
  },
  L: {
    label: 'Rigid Truck',
    maxWeightKg: 8_000,
    description: 'Heavy machinery and distribution',
    pricePerKmKz: 650,
  },
  XL: {
    label: 'Semi-Trailer',
    maxWeightKg: 25_000,
    description: 'Large scale freight',
    pricePerKmKz: 1_200,
  },
};
