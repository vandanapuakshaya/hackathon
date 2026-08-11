import React from 'react';
import { Sprout, ShieldAlert, Globe2, History, Sparkles } from 'lucide-react';
import type { Language, WeatherData } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  weather: WeatherData | null;
  activeTab: 'scanner' | 'climate' | 'history';
  onTabChange: (tab: 'scanner' | 'climate' | 'history') => void;
  savedAdvisoriesCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLangChange,
  weather,
  activeTab,
  onTabChange,
  savedAdvisoriesCount,
  onOpenHistory
}) => {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">
                Agri<span className="text-emerald-400">Shield</span> <span className="text-amber-400 text-xs font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">AI LIVE</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">Real-time Field Input & Expert Agronomic Bridge</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('scanner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Field Scanner & AI Diagnostic
          </button>

          <button
            onClick={() => onTabChange('climate')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'climate'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Outbreak Alert & Climate Map
          </button>
        </nav>

        {/* Right Widgets: Weather Status, Language Picker, History */}
        <div className="flex items-center gap-3">
          
          {/* Live Weather Micro-badge */}
          {weather && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold">{weather.temperature}°C</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">{weather.humidity}% RH</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{weather.windSpeed} km/h wind</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="View saved agronomic field advisories"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedAdvisoriesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {savedAdvisoriesCount}
              </span>
            )}
          </button>

          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE</span>
          </div>

        </div>

      </div>
    </header>
  );
};
