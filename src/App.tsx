import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { FieldScanner } from './components/FieldScanner';
import { AdvisoryDashboard } from './components/AdvisoryDashboard';
import { ClimateMap } from './components/ClimateMap';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PRESET_LOCATIONS, PRESET_SAMPLE_LEAVES } from './data/presetLeafSamples';
import type { GeoLocation, WeatherData, AdvisoryPlan, Language, CropIssueSample } from './types';
import { fetchLiveWeather } from './services/weatherApi';
import { generateAgronomicAdvisory } from './services/aiAgronomicEngine';
import { Sprout, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'scanner' | 'climate' | 'history'>('scanner');
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(PRESET_LOCATIONS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [advisory, setAdvisory] = useState<AdvisoryPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // LocalStorage History
  const [savedAdvisories, setSavedAdvisories] = useState<AdvisoryPlan[]>(() => {
    try {
      const saved = localStorage.getItem('agrishield_saved_advisories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch live weather when location changes
  useEffect(() => {
    let isMounted = true;
    fetchLiveWeather(selectedLocation).then((data) => {
      if (isMounted) {
        setWeather(data);
      }
    });
    return () => { isMounted = false; };
  }, [selectedLocation]);

  // Initial load: generate initial advisory for instant demo readiness
  useEffect(() => {
    if (weather && !advisory) {
      const initialPlan = generateAgronomicAdvisory({
        selectedSample: PRESET_SAMPLE_LEAVES[0],
        location: selectedLocation,
        weather,
        cropType: 'Tomato',
        growthStage: 'Flowering / Fruiting',
        farmerNote: 'Dark brownish spots on leaves after heavy dew night.'
      });
      setAdvisory(initialPlan);
    }
  }, [weather]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAnalyze = async (params: {
    selectedSample?: CropIssueSample;
    customImageDataUrl?: string;
    cropType: string;
    growthStage: string;
    farmerNote: string;
  }) => {
    setIsAnalyzing(true);

    // Refresh weather or use current
    const currentWeatherData = weather || await fetchLiveWeather(selectedLocation);

    setTimeout(() => {
      const newPlan = generateAgronomicAdvisory({
        selectedSample: params.selectedSample,
        customImageDataUrl: params.customImageDataUrl,
        location: selectedLocation,
        weather: currentWeatherData,
        cropType: params.cropType,
        growthStage: params.growthStage,
        farmerNote: params.farmerNote
      });

      setAdvisory(newPlan);
      setIsAnalyzing(false);

      // Trigger celebratory micro-confetti for successful diagnosis
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4']
      });

      showToast('AI Agronomic Scan Completed Successfully!');
    }, 1000);
  };

  const handleSaveAdvisory = (planToSave: AdvisoryPlan) => {
    if (savedAdvisories.some((a) => a.id === planToSave.id)) {
      showToast('Advisory is already saved in history.');
      return;
    }
    const updated = [planToSave, ...savedAdvisories];
    setSavedAdvisories(updated);
    try {
      localStorage.setItem('agrishield_saved_advisories', JSON.stringify(updated));
    } catch (e) {}
    showToast('Saved to field advisories history!');
  };

  const handleDeleteAdvisory = (id: string) => {
    const updated = savedAdvisories.filter((a) => a.id !== id);
    setSavedAdvisories(updated);
    try {
      localStorage.setItem('agrishield_saved_advisories', JSON.stringify(updated));
    } catch (e) {}
    showToast('Advisory removed from history.');
  };

  const handleClearAllHistory = () => {
    setSavedAdvisories([]);
    localStorage.removeItem('agrishield_saved_advisories');
    showToast('All saved advisories cleared.');
  };

  const isCurrentSaved = advisory ? savedAdvisories.some((a) => a.id === advisory.id) : false;

  return (
    <div className="min-h-screen bg-[#0b131e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        weather={weather}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedAdvisoriesCount={savedAdvisories.length}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
      />

      {/* App Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Tab 1: Scanner & Active Advisory Dashboard */}
        {activeTab === 'scanner' && (
          <div className="space-y-10">
            
            {/* Field Input Scanner Component */}
            <FieldScanner
              weather={weather}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            {/* Active AI Diagnostic Results Dashboard */}
            {advisory && (
              <div className="pt-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Actionable Agronomic Advisory & Guidance Output
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                    Scan ID: {advisory.id}
                  </span>
                </div>

                <AdvisoryDashboard
                  advisory={advisory}
                  currentLang={currentLang}
                  onLangChange={setCurrentLang}
                  onSaveAdvisory={handleSaveAdvisory}
                  isSaved={isCurrentSaved}
                />
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Outbreak Alert & Climate Map */}
        {activeTab === 'climate' && (
          <ClimateMap location={selectedLocation} />
        )}

      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        savedAdvisories={savedAdvisories}
        onSelectAdvisory={(selectedAdv) => {
          setAdvisory(selectedAdv);
          setActiveTab('scanner');
          showToast(`Loaded Advisory for ${selectedAdv.diagnosis.issueName}`);
        }}
        onDeleteAdvisory={handleDeleteAdvisory}
        onClearAll={handleClearAllHistory}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">AgriShield AI</span> — Bridging raw field conditions & expert agronomic guidance
          </div>
          <p className="text-slate-400 m-0">Powered by Open-Meteo Weather Signals & Multimodal Diagnostic Intelligence</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
