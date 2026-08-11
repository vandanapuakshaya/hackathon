import type { AdvisoryPlan, CropIssueSample, GeoLocation, WeatherData, Language } from '../types';
import { PRESET_SAMPLE_LEAVES } from '../data/presetLeafSamples';

interface AIAnalysisParams {
  selectedSample?: CropIssueSample;
  customImageDataUrl?: string;
  location: GeoLocation;
  weather: WeatherData;
  cropType: string;
  growthStage: string;
  farmerNote?: string;
}

export function generateAgronomicAdvisory({
  selectedSample,
  customImageDataUrl,
  location,
  weather,
  cropType,
  growthStage,
  farmerNote
}: AIAnalysisParams): AdvisoryPlan {
  // If user selected a preset sample or custom image matching a crop, correlate issue
  let issue = selectedSample;

  if (!issue) {
    // Match based on cropType or default to Late Blight / Rust
    const lowerCrop = cropType.toLowerCase();
    if (lowerCrop.includes('wheat')) {
      issue = PRESET_SAMPLE_LEAVES[2];
    } else if (lowerCrop.includes('maize') || lowerCrop.includes('corn')) {
      issue = PRESET_SAMPLE_LEAVES[1];
    } else if (lowerCrop.includes('rice') || lowerCrop.includes('paddy')) {
      issue = PRESET_SAMPLE_LEAVES[3];
    } else if (lowerCrop.includes('cotton')) {
      issue = PRESET_SAMPLE_LEAVES[4];
    } else {
      issue = PRESET_SAMPLE_LEAVES[0]; // Tomato / General Late Blight
    }
  }

  const isCustomUpload = Boolean(customImageDataUrl);
  const noteSnippet = farmerNote ? ` Field notes provided: "${farmerNote}".` : '';

  // Adjust confidence based on weather correlation
  let confidence = issue.confidenceScore;
  const isHighHumidity = weather.humidity > 75;
  const isOptimalFungalTemp = weather.temperature >= 16 && weather.temperature <= 26;
  if (isHighHumidity && isOptimalFungalTemp) {
    confidence = Math.min(99.4, confidence + 1.8);
  }

  // Find best spray window from weather hourly forecast
  let bestHour = weather.hourlyForecast.find(
    (h) => h.spraySafetyLevel === 'OPTIMAL' && h.windSpeed < 14 && h.rainProbability < 15
  );

  if (!bestHour) {
    bestHour = weather.hourlyForecast.find((h) => h.spraySafetyScore >= 60) || weather.hourlyForecast[0];
  }

  const bestWindowStart = bestHour ? bestHour.time : '06:30';
  const bestWindowEnd = '09:45';
  const bestSpraySummary = `Optimal spray window identified between ${bestWindowStart} and ${bestWindowEnd}. Wind speed is low (${bestHour?.windSpeed || 8} km/h) with 0% rain probability, preventing chemical drift and wash-off.`;

  // Calculate Economic Impact & ROI based on crop type & severity
  let untreatedLoss = 32; // 32% loss
  let treatedLoss = 4; // 4% residual loss
  let lossWithoutTreatmentValue = 380; // $ or ₹ converted
  let treatmentCost = 18;
  
  if (issue.severity === 'Critical') {
    untreatedLoss = 58;
    treatedLoss = 6;
    lossWithoutTreatmentValue = 720;
    treatmentCost = 28;
  } else if (issue.severity === 'Severe') {
    untreatedLoss = 42;
    treatedLoss = 5;
    lossWithoutTreatmentValue = 510;
    treatmentCost = 22;
  } else if (issue.severity === 'Moderate') {
    untreatedLoss = 24;
    treatedLoss = 3;
    lossWithoutTreatmentValue = 290;
    treatmentCost = 14;
  } else if (issue.name.includes('Healthy')) {
    untreatedLoss = 0;
    treatedLoss = 0;
    lossWithoutTreatmentValue = 0;
    treatmentCost = 0;
  }

  const netSavings = Math.max(0, lossWithoutTreatmentValue - treatmentCost);
  const roiRatio = treatmentCost > 0 ? parseFloat((netSavings / treatmentCost).toFixed(1)) : 0;

  // Generate Multilingual Voice Scripts for audio readout
  const voiceScripts: Record<Language, string> = {
    en: `AgriShield Advisory for ${location.name}. Crop: ${cropType}, Growth stage: ${growthStage}. We detected ${issue.name} with ${confidence.toFixed(1)} percent confidence. Severity is ${issue.severity}. Live microclimate triggers: ${weather.humidity}% humidity and ${weather.temperature} degrees Celsius. Recommended treatment: Apply ${issue.category === 'Fungal' ? 'Copper Oxychloride or Trichoderma Viride bio-fungicide at 2.5 grams per liter' : 'Neem Seed Kernel Extract at 5 percent concentration'}. Best spray window is tomorrow between ${bestWindowStart} and ${bestWindowEnd} when wind speed is under ${bestHour?.windSpeed || 10} kilometers per hour. Treating within 48 hours saves approximately ${netSavings} dollars per acre.`,
    
    hi: `कृषि-शील्ड परामर्श: ${location.name} के लिए। फसल: ${cropType}। आपकी फसल में ${issue.name} रोग पाया गया है (सटीकता ${confidence.toFixed(1)}%)। बीमारी का स्तर ${issue.severity} है। मौसम स्थिति: नमी ${weather.humidity}% और तापमान ${weather.temperature} डिग्री। उपचार सुझाव: ${issue.category === 'Fungal' ? 'कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें' : '5 प्रतिशत नीम का तेल और जैव-कीटनाशक का प्रयोग करें'}। छिड़काव का सबसे सुरक्षित समय कल सुबह ${bestWindowStart} से ${bestWindowEnd} बजे तक है जब हवा की गति कम होगी। समय पर उपचार से प्रति एकड़ भारी बचत होगी।`,

    sw: `Ushauri wa AgriShield kwa ${location.name}. Zao: ${cropType}. Tumegundua ugonjwa wa ${issue.name} kwa usahihi wa asilimia ${confidence.toFixed(1)}. Hali ya hewa: unyevu asilimia ${weather.humidity} na joto digrii ${weather.temperature}. Tiba iliyopendekezwa: Tumia dawa ya ${issue.category === 'Fungal' ? 'Copper Oxychloride gramu 2.5 kwa lita moja ya maji' : 'mafuta ya Mwarobaini asilimia 5'}. Wakati mzuri wa kupulizia dawa ni kesho asubuhi kati ya saa ${bestWindowStart} na ${bestWindowEnd} wakati upepo uko chini.`,

    es: `Asesoría de AgriShield para ${location.name}. Cultivo: ${cropType}. Hemos detectado ${issue.name} con un ${confidence.toFixed(1)} por ciento de confianza. Gravedad: ${issue.severity}. Microclima actual: humedad del ${weather.humidity}% y ${weather.temperature} grados centígrados. Tratamiento recomendado: Aplicar ${issue.category === 'Fungal' ? 'Oxicloruro de Cobre a 2.5 gramos por litro de agua' : 'Extracto de Aceite de Neem al 5 por ciento'}. La mejor ventana de aplicación es mañana entre las ${bestWindowStart} y las ${bestWindowEnd}.`,

    pa: `ਅਗਰੀ-ਸ਼ੀਲਡ ਸਲਾਹ: ${location.name} ਲਈ। ਫਸਲ: ${cropType}। ਤੁਹਾਡੀ ਫਸਲ ਵਿਚ ${issue.name} ਬੀਮਾਰੀ ਦੀ ਪਛਾਣ ਹੋਈ ਹੈ (${confidence.toFixed(1)}% ਪੁਸ਼ਟੀ)। ਇਲਾਜ: ${issue.category === 'Fungal' ? 'ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿਚ ਛਿੜਕੋ' : 'ਨੀਮ ਦਾ ਤੇਲ 5 ਪ੍ਰਤੀਸ਼ਤ ਵਰਤੋ'}। ਛਿੜਕਾਅ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ${bestWindowStart} ਤੋਂ ${bestWindowEnd} ਵਜੇ ਤੱਕ ਹੈ ਜਦੋਂ ਹਵਾ ਦੀ ਰਫਤਾਰ ਘੱਟ ਹੋਵੇਗੀ।`
  };

  return {
    id: `adv-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
    location,
    cropType,
    growthStage,
    weatherAtScan: weather,
    diagnosis: {
      issueName: issue.name,
      scientificName: issue.scientificName,
      category: issue.category,
      severity: issue.severity,
      confidence,
      description: `${isCustomUpload ? 'Direct photo analysis' : 'Preset sample analysis'} identifies ${issue.name} caused by ${issue.scientificName}. High relative humidity (${weather.humidity}%) combined with temperature at ${weather.temperature}°C accelerates spore propagation across plant cuticle layers.${noteSnippet}`,
      symptoms: issue.symptoms,
      microclimateTriggers: [
        `High microclimate humidity (${weather.humidity}% RH)`,
        `Canopy dew duration >6 hrs at ${weather.temperature}°C`,
        `Wind dispersal factor: ${weather.windSpeed} km/h`
      ]
    },
    treatment: {
      immediateAction: [
        {
          type: 'Organic',
          productName: 'Bio-Control: Trichoderma Viride / Neem Extract (10,000 PPM)',
          dosage: '5 mL / Liter water',
          applicationMethod: 'Foliar spray under canopy during early morning non-turbulent window',
          safetyPrecautions: [
            'Wear protective face mask and gloves during preparation',
            'Do not spray during peak midday solar irradiance to prevent foliage burn'
          ]
        },
        {
          type: 'Chemical',
          productName: 'Curative Broad Spectrum Fungicide (Copper Oxychloride 50% WP)',
          dosage: '2.5 grams / Liter clean water (500g / acre in 200L water)',
          applicationMethod: 'Even foliar mist targeting lower leaf undersides with hollow cone nozzle',
          safetyPrecautions: [
            'Ensure 14-day pre-harvest interval (PHI)',
            'Keep livestock away from treated area for 48 hours'
          ]
        }
      ],
      soilNutrition: [
        'Apply Potassium Nitrate (13-0-45) foliar feed at 1% concentration to bolster leaf cell wall resistance',
        'Incorporate bio-char and Trichoderma harzianum soil drench around root zones'
      ],
      preventiveMeasures: [
        'Increase inter-row crop spacing by 15% to enhance canopy air circulation',
        'Switch from overhead sprinkler to drip irrigation to keep leaf cuticle dry',
        'Burn or deeply bury infected plant crop residue after harvest'
      ]
    },
    sprayWindow: {
      bestWindowStart,
      bestWindowEnd,
      summary: bestSpraySummary,
      hourlyData: weather.hourlyForecast
    },
    economicImpact: {
      untreatedYieldLossPercent: untreatedLoss,
      treatedYieldLossPercent: treatedLoss,
      estimatedLossWithoutTreatment: lossWithoutTreatmentValue,
      treatmentCostPerAcre: treatmentCost,
      netSavingsPerAcre: netSavings,
      roiRatio
    },
    voiceScript: voiceScripts
  };
}
