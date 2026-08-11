import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, MapPin, Sun, Sparkles, 
  CheckCircle2, Layers, RefreshCw, Zap, Image as ImageIcon, MessageSquare
} from 'lucide-react';
import type { CropIssueSample, GeoLocation, WeatherData } from '../types';
import { PRESET_SAMPLE_LEAVES, PRESET_LOCATIONS } from '../data/presetLeafSamples';

interface FieldScannerProps {
  weather: WeatherData | null;
  selectedLocation: GeoLocation;
  onLocationChange: (loc: GeoLocation) => void;
  onAnalyze: (params: {
    selectedSample?: CropIssueSample;
    customImageDataUrl?: string;
    cropType: string;
    growthStage: string;
    farmerNote: string;
  }) => void;
  isAnalyzing: boolean;
}

export const FieldScanner: React.FC<FieldScannerProps> = ({
  weather,
  selectedLocation,
  onLocationChange,
  onAnalyze,
  isAnalyzing
}) => {
  const [selectedPreset, setSelectedPreset] = useState<CropIssueSample | null>(PRESET_SAMPLE_LEAVES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>('Tomato');
  const [growthStage, setGrowthStage] = useState<string>('Flowering / Fruiting');
  const [farmerNote, setFarmerNote] = useState<string>('Dark brownish spots appearing on upper leaves after recent damp night dew.');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomImage(result);
        setSelectedPreset(null); // Deselect preset when custom uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger camera snapshot simulation
  const handleSimulateCamera = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      // Simulate live capture by assigning a high-res sample
      const randomPreset = PRESET_SAMPLE_LEAVES[Math.floor(Math.random() * (PRESET_SAMPLE_LEAVES.length - 1))];
      setCustomImage(randomPreset.imagePlaceholder);
      setSelectedPreset(null);
      setIsCameraActive(false);
    }, 1200);
  };

  const handleSelectPreset = (sample: CropIssueSample) => {
    setSelectedPreset(sample);
    setCustomImage(null);
    setCropType(sample.cropType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      selectedSample: selectedPreset || undefined,
      customImageDataUrl: customImage || undefined,
      cropType,
      growthStage,
      farmerNote
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Intro Banner */}
      <div className="glass-panel-emerald rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              Multimodal Agronomic Intelligence Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight m-0">
              Convert Raw Field Signals into Actionable Expert Guidance
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Upload a leaf photo, pick your farm location, and get instant disease diagnostics, weather-aware safe spray timing, and financial ROI protection plans.
            </p>
          </div>
          
          <button
            onClick={() => onAnalyze({
              selectedSample: selectedPreset || PRESET_SAMPLE_LEAVES[0],
              customImageDataUrl: customImage || undefined,
              cropType,
              growthStage,
              farmerNote
            })}
            disabled={isAnalyzing}
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                Analyzing Microclimate & Leaf Pathology...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Run AI Diagnostic Scan
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Scanner & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Leaf Photo Upload & Camera Workspace */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Field Input: Diseased Leaf / Crop Photo
              </label>
              <span className="text-xs text-amber-400 font-mono">100% Unstructured Input Supported</span>
            </div>

            {/* Active Preview Area with Scanner Reticle */}
            <div className="relative w-full h-72 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-700/80 overflow-hidden flex items-center justify-center group">
              
              {isCameraActive && (
                <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center gap-3">
                  <Camera className="w-10 h-10 text-emerald-400 animate-bounce" />
                  <p className="text-xs font-mono text-emerald-300">Simulating Live Optical Field Capture...</p>
                </div>
              )}

              {/* Scanning Laser Line */}
              <div className="animate-scan"></div>

              {customImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={customImage}
                    alt="Uploaded Field Leaf"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Custom Leaf Upload Active
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomImage(null)}
                    className="absolute top-3 right-3 bg-red-950/90 text-red-300 border border-red-800 text-xs px-2.5 py-1 rounded-lg hover:bg-red-900 transition"
                  >
                    Clear
                  </button>
                </div>
              ) : selectedPreset ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedPreset.imagePlaceholder}
                    alt={selectedPreset.name}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Preset Sample: {selectedPreset.name}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <Upload className="w-10 h-10 text-slate-500 mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Drag & Drop crop photo here</p>
                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP or capture directly</p>
                  </div>
                </div>
              )}

              {/* Bounding box target overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border border-emerald-500/30 rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                  <span className="absolute bottom-1 right-2 text-[10px] font-mono text-emerald-400/70">AI RETICLE ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Camera & Upload */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Upload Photo File
              </button>

              <button
                type="button"
                onClick={handleSimulateCamera}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                Live Camera Capture
              </button>
            </div>
          </div>

          {/* Preset Sample Gallery for Zero-Friction Testing */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Instant Demo Presets (Click any to test)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">6 Real-world Diseases</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PRESET_SAMPLE_LEAVES.map((sample) => {
                const isSelected = selectedPreset?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectPreset(sample)}
                    className={`relative rounded-xl p-1.5 border transition-all text-left overflow-hidden group ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950/80 ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="w-full h-14 rounded-lg bg-slate-950 overflow-hidden mb-1.5">
                      <img
                        src={sample.imagePlaceholder}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-200 truncate leading-tight">{sample.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{sample.cropType}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Location, Live Weather & Crop Context (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Location & Microclimate Selector Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Farmer Location & Micro-Climate Region
              </label>
            </div>

            {/* Location Select Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Select Agricultural Region / Zone:</p>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_LOCATIONS.map((loc) => {
                  const isSelected = selectedLocation.name === loc.name;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => onLocationChange(loc)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500/80 text-white'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{loc.name}, {loc.country}</p>
                        <p className="text-[10px] text-slate-400">{loc.region} • {loc.soilType}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded">
                        {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Weather Metrics Indicator */}
            {weather && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Live Micro-Climate Signals
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    Open-Meteo Live API
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <p className="text-[10px] text-slate-400 uppercase">Temperature</p>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">{weather.temperature}°C</p>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <p className="text-[10px] text-slate-400 uppercase">Humidity</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{weather.humidity}%</p>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <p className="text-[10px] text-slate-400 uppercase">Wind Speed</p>
                    <p className="text-sm font-bold text-cyan-400 mt-0.5">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crop Context & Notes Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
              <Layers className="w-4 h-4 text-emerald-400" />
              Crop Context & Field Symptoms
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Crop Type</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Maize / Corn">Maize / Corn</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice / Paddy">Rice / Paddy</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Potato">Potato</option>
                  <option value="Chilli">Chilli</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Growth Stage</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Vegetative Phase">Vegetative Phase</option>
                  <option value="Flowering / Fruiting">Flowering / Fruiting</option>
                  <option value="Maturation / Harvest">Maturation / Harvest</option>
                  <option value="Seedling Phase">Seedling Phase</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Farmer Field Notes / Unstructured Symptoms
              </label>
              <textarea
                value={farmerNote}
                onChange={(e) => setFarmerNote(e.target.value)}
                placeholder="Describe visible spots, wilting, leaf yellowing, or recent rain..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
