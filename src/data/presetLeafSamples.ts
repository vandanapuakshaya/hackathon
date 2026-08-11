import type { CropIssueSample, GeoLocation } from '../types';

// SVG Helper to generate vibrant, realistic leaf graphics with disease spots
function createLeafSvg(
  baseColor: string,
  spotColor: string,
  spotCount: number,
  diseaseLabel: string
): string {
  const spots = [];
  for (let i = 0; i < spotCount; i++) {
    const cx = 100 + (Math.sin(i * 1.5) * 50 + (i % 3) * 20);
    const cy = 60 + i * 22;
    const r = 6 + (i % 4) * 5;
    spots.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${spotColor}" opacity="0.85"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r * 1.3}" fill="none" stroke="${spotColor}" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.6"/>`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
    <rect width="300" height="300" fill="#0f172a"/>
    <defs>
      <linearGradient id="leafGrad${diseaseLabel.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${baseColor}" />
        <stop offset="100%" stop-color="#064e3b" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background Grid lines -->
    <path d="M0 50 H300 M0 100 H300 M0 150 H300 M0 200 H300 M0 250 H300" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <path d="M50 0 V300 M100 0 V300 M150 0 V300 M200 0 V300 M250 0 V300" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    
    <!-- Main Leaf Body -->
    <path d="M150 20 C220 70, 260 170, 150 270 C40 170, 80 70, 150 20 Z" fill="url(#leafGrad${diseaseLabel.replace(/\s+/g, '')})" stroke="#34d399" stroke-width="2"/>
    
    <!-- Central Leaf Vein -->
    <path d="M150 25 L150 265" stroke="#a7f3d0" stroke-width="3" opacity="0.7"/>
    <!-- Side Veins -->
    <path d="M150 60 Q180 80 210 100 M150 100 Q190 130 225 150 M150 140 Q195 180 220 210" stroke="#a7f3d0" stroke-width="1.5" opacity="0.5"/>
    <path d="M150 60 Q120 80 90 100 M150 100 Q110 130 75 150 M150 140 Q105 180 80 210" stroke="#a7f3d0" stroke-width="1.5" opacity="0.5"/>
    
    <!-- Disease Lesions / Spots -->
    ${spots.join('\n')}
    
    <!-- Scanner overlay box -->
    <rect x="55" y="45" width="190" height="200" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.8"/>
    <text x="65" y="40" fill="#f59e0b" font-family="sans-serif" font-size="11" font-weight="bold">AI ROI SCAN: ${diseaseLabel.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_SAMPLE_LEAVES: CropIssueSample[] = [
  {
    id: 'sample-tomato-late-blight',
    name: 'Tomato Late Blight',
    cropType: 'Tomato',
    scientificName: 'Phytophthora infestans',
    category: 'Fungal',
    severity: 'Severe',
    confidenceScore: 97.2,
    imagePlaceholder: createLeafSvg('#22c55e', '#78350f', 7, 'Late Blight'),
    boundingBoxes: [
      { x: 25, y: 20, width: 45, height: 35, label: 'Necrotic Lesion (97.2%)' },
      { x: 50, y: 55, width: 40, height: 30, label: 'Fungal Spore halo' }
    ],
    symptoms: [
      'Large dark water-soaked lesions on leaf surface',
      'White fluffy mold growth on undersides in humid conditions',
      'Rapid leaf drop and stem lesions'
    ],
    rootCauses: [
      'Extended leaf wetness (>10 hours)',
      'High relative humidity (>85%)',
      'Temperatures between 18°C - 24°C'
    ]
  },
  {
    id: 'sample-maize-northern-blight',
    name: 'Maize Northern Corn Leaf Blight',
    cropType: 'Maize / Corn',
    scientificName: 'Exserohilum turcicum',
    category: 'Fungal',
    severity: 'Moderate',
    confidenceScore: 94.8,
    imagePlaceholder: createLeafSvg('#16a34a', '#854d0e', 6, 'Corn Leaf Blight'),
    boundingBoxes: [
      { x: 30, y: 30, width: 50, height: 25, label: 'Cigar Lesion (94.8%)' }
    ],
    symptoms: [
      'Long elliptical grayish-green or tan lesions (cigar-shaped)',
      'Dark fungal sporulation inside lesions during wet periods',
      'Premature leaf death starting from lower canopy'
    ],
    rootCauses: [
      'Moderate temperature (20°C - 26°C)',
      'Dew periods exceeding 6-8 hours',
      'Infected crop residue from previous harvest'
    ]
  },
  {
    id: 'sample-wheat-stripe-rust',
    name: 'Wheat Stripe Rust (Yellow Rust)',
    cropType: 'Wheat',
    scientificName: 'Puccinia striiformis',
    category: 'Fungal',
    severity: 'Critical',
    confidenceScore: 98.4,
    imagePlaceholder: createLeafSvg('#15803d', '#ca8a04', 9, 'Yellow Stripe Rust'),
    boundingBoxes: [
      { x: 20, y: 15, width: 60, height: 65, label: 'Linear Pustules (98.4%)' }
    ],
    symptoms: [
      'Bright yellow to orange pustules arranged in distinct stripes along leaf veins',
      'Chlorotic streaks on younger upper canopy leaves',
      'Powdery yellow spores rubbing off easily'
    ],
    rootCauses: [
      'Cool moist weather (10°C - 15°C)',
      'Heavy morning dew or rain showers',
      'Susceptible crop variety cultivar'
    ]
  },
  {
    id: 'sample-rice-bacterial-blight',
    name: 'Rice Bacterial Blight',
    cropType: 'Rice / Paddy',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    category: 'Bacterial',
    severity: 'Severe',
    confidenceScore: 92.1,
    imagePlaceholder: createLeafSvg('#166534', '#a16207', 5, 'Bacterial Blight'),
    boundingBoxes: [
      { x: 35, y: 25, width: 40, height: 40, label: 'Wavy Margin (92.1%)' }
    ],
    symptoms: [
      'Water-soaked lesions on leaf margins expanding into wavy yellow-white stripes',
      'Bacterial ooze droplets visible early morning on young leaves',
      'Leaves turn grayish white and dry up'
    ],
    rootCauses: [
      'High humidity and heavy monsoon wind/rainstorms',
      'Excessive nitrogen fertilizer application',
      'Wounds caused by typhoon winds or leaf handling'
    ]
  },
  {
    id: 'sample-cotton-anthracnose',
    name: 'Cotton Anthracnose',
    cropType: 'Cotton',
    scientificName: 'Colletotrichum gossypii',
    category: 'Fungal',
    severity: 'Moderate',
    confidenceScore: 89.6,
    imagePlaceholder: createLeafSvg('#14532d', '#9a3412', 6, 'Cotton Anthracnose'),
    boundingBoxes: [
      { x: 30, y: 35, width: 35, height: 35, label: 'Circular Spot (89.6%)' }
    ],
    symptoms: [
      'Small reddish-brown circular spots with yellowish margins on leaves',
      'Sunken lesions on cotton bolls with pinkish spore masses',
      'Damping off of young seedlings'
    ],
    rootCauses: [
      'Warm humid environment (25°C - 30°C)',
      'Frequent cloud cover and rain splash',
      'Infected seed stocks'
    ]
  },
  {
    id: 'sample-healthy-crop',
    name: 'Healthy Crop (No Disease Detected)',
    cropType: 'Mixed Agronomic',
    scientificName: 'Physiological Normal',
    category: 'Nutrient Deficiency', // Not a disease
    severity: 'Low',
    confidenceScore: 99.1,
    imagePlaceholder: createLeafSvg('#22c55e', '#16a34a', 0, 'Healthy Leaf'),
    boundingBoxes: [
      { x: 10, y: 10, width: 80, height: 80, label: 'Healthy Tissue (99.1%)' }
    ],
    symptoms: [
      'Uniform rich green pigmentation across leaf blade',
      'Intact cuticle barrier with no fungal or bacterial lesions',
      'Normal stoma distribution and leaf turgor pressure'
    ],
    rootCauses: [
      'Optimal microclimate conditions',
      'Balanced soil organic carbon and moisture',
      'Proactive agronomic crop management'
    ]
  }
];

export const PRESET_LOCATIONS: GeoLocation[] = [
  {
    name: 'Ludhiana, Punjab',
    region: 'North Wheat & Rice Belt',
    country: 'India',
    latitude: 30.901,
    longitude: 75.8573,
    soilType: 'Alluvial Loam',
    majorCrops: ['Wheat', 'Rice', 'Mustard', 'Cotton']
  },
  {
    name: 'Nakuru, Rift Valley',
    region: 'Highland Maize Zone',
    country: 'Kenya',
    latitude: -0.3031,
    longitude: 36.08,
    soilType: 'Volcanic Ash Soil',
    majorCrops: ['Maize', 'Potatoes', 'Wheat', 'Beans']
  },
  {
    name: 'Des Moines, Iowa',
    region: 'Corn & Soybean Belt',
    country: 'USA',
    latitude: 41.5868,
    longitude: -93.625,
    soilType: 'Rich Prairie Mollisols',
    majorCrops: ['Corn', 'Soybeans', 'Oats']
  },
  {
    name: 'Guntur, Andhra Pradesh',
    region: 'Chilli & Cotton Zone',
    country: 'India',
    latitude: 16.3067,
    longitude: 80.4365,
    soilType: 'Black Cotton Soil (Vertisol)',
    majorCrops: ['Chilli', 'Cotton', 'Rice', 'Tobacco']
  },
  {
    name: 'Fresno, Central Valley',
    region: 'San Joaquin Ag Belt',
    country: 'USA',
    latitude: 36.7468,
    longitude: -119.7726,
    soilType: 'Deep Alluvial Sandy Loam',
    majorCrops: ['Tomatoes', 'Almonds', 'Grapes', 'Citrus']
  }
];
