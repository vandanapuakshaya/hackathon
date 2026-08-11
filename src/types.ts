export type Language = 'en' | 'hi' | 'sw' | 'es' | 'pa';

export interface GeoLocation {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  soilType: string;
  majorCrops: string[];
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  rainfallProbability: number; // %
  uvIndex: number;
  dewPoint: number; // °C
  condition: string; // e.g., 'Overcast', 'Light Rain', 'Sunny'
  hourlyForecast: HourlyWeatherForecast[];
}

export interface HourlyWeatherForecast {
  time: string; // e.g., "14:00"
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  spraySafetyScore: number; // 0 to 100
  spraySafetyLevel: 'OPTIMAL' | 'SUB_OPTIMAL' | 'HAZARDOUS';
  hazardReason?: string;
}

export interface CropIssueSample {
  id: string;
  name: string;
  cropType: string;
  scientificName: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Nutrient Deficiency' | 'Pest Damage';
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  imagePlaceholder: string; // Data URL or Image URL
  confidenceScore: number; // 0 - 100%
  boundingBoxes: { x: number; y: number; width: number; height: number; label: string }[];
  symptoms: string[];
  rootCauses: string[];
}

export interface AdvisoryPlan {
  id: string;
  timestamp: string;
  location: GeoLocation;
  cropType: string;
  growthStage: string;
  weatherAtScan: WeatherData;
  diagnosis: {
    issueName: string;
    scientificName: string;
    category: string;
    severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
    confidence: number;
    description: string;
    symptoms: string[];
    microclimateTriggers: string[];
  };
  treatment: {
    immediateAction: {
      type: 'Organic' | 'Chemical' | 'Biological';
      productName: string;
      dosage: string;
      applicationMethod: string;
      safetyPrecautions: string[];
    }[];
    soilNutrition: string[];
    preventiveMeasures: string[];
  };
  sprayWindow: {
    bestWindowStart: string;
    bestWindowEnd: string;
    summary: string;
    hourlyData: HourlyWeatherForecast[];
  };
  economicImpact: {
    untreatedYieldLossPercent: number; // e.g. 35%
    treatedYieldLossPercent: number; // e.g. 4%
    estimatedLossWithoutTreatment: number; // $ or ₹ per acre
    treatmentCostPerAcre: number;
    netSavingsPerAcre: number;
    roiRatio: number;
  };
  voiceScript: Record<Language, string>;
}

export interface OutbreakAlert {
  id: string;
  crop: string;
  disease: string;
  distanceKm: number;
  severity: 'High' | 'Medium' | 'Low';
  reportedDate: string;
  locationName: string;
  casesCount: number;
  latitude: number;
  longitude: number;
}
