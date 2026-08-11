import type { OutbreakAlert } from '../types';

export const MOCK_OUTBREAK_ALERTS: OutbreakAlert[] = [
  {
    id: 'outbreak-1',
    crop: 'Wheat',
    disease: 'Yellow Stripe Rust',
    distanceKm: 12.4,
    severity: 'High',
    reportedDate: '2 hours ago',
    locationName: 'Jagraon Sector 4, Punjab',
    casesCount: 18,
    latitude: 30.95,
    longitude: 75.60
  },
  {
    id: 'outbreak-2',
    crop: 'Maize',
    disease: 'Fall Armyworm Infestation',
    distanceKm: 28.1,
    severity: 'High',
    reportedDate: 'Yesterday',
    locationName: 'Molo Sub-County, Rift Valley',
    casesCount: 42,
    latitude: -0.25,
    longitude: 35.73
  },
  {
    id: 'outbreak-3',
    crop: 'Tomato',
    disease: 'Late Blight (Phytophthora)',
    distanceKm: 8.7,
    severity: 'Medium',
    reportedDate: '5 hours ago',
    locationName: 'Khanna Cluster, Punjab',
    casesCount: 9,
    latitude: 30.70,
    longitude: 76.22
  },
  {
    id: 'outbreak-4',
    crop: 'Rice',
    disease: 'Bacterial Leaf Streak',
    distanceKm: 34.5,
    severity: 'Medium',
    reportedDate: '1 day ago',
    locationName: 'Tenali Delta Region, Guntur',
    casesCount: 15,
    latitude: 16.24,
    longitude: 80.64
  },
  {
    id: 'outbreak-5',
    crop: 'Cotton',
    disease: 'Whitefly Leaf Curl Virus',
    distanceKm: 19.3,
    severity: 'Low',
    reportedDate: '3 days ago',
    locationName: 'Abohar Hub, Punjab',
    casesCount: 6,
    latitude: 30.14,
    longitude: 74.19
  }
];
