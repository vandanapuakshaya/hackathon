import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, TrendingUp, AlertTriangle,
  CheckCircle2, Info, Leaf, Bug, Droplets, Printer
} from 'lucide-react';
import type { AdvisoryPlan, Language } from '../types';
import { SprayWindowChart } from './SprayWindowChart';
import { ImpactCalculator } from './ImpactCalculator';
import { VoicePlayer } from './VoicePlayer';
import { ReportExportModal } from './ReportExportModal';

interface AdvisoryDashboardProps {
  advisory: AdvisoryPlan;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  onSaveAdvisory: (adv: AdvisoryPlan) => void;
  isSaved: boolean;
}

export const AdvisoryDashboard: React.FC<AdvisoryDashboardProps> = ({
  advisory,
  currentLang,
  onLangChange,
  onSaveAdvisory,
  isSaved
}) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'treatment' | 'spray' | 'impact'>('diagnosis');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-950/80 text-red-300 border-red-500/50';
      case 'Severe':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Moderate':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/50';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Advisory Hero Bar */}
      <div className="glass-panel-emerald rounded-3xl p-6 border border-emerald-500/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Issue summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getSeverityBadge(advisory.diagnosis.severity)}`}>
                SEVERITY: {advisory.diagnosis.severity.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-800 px-3 py-1 rounded-full">
                AI CONFIDENCE: {advisory.diagnosis.confidence.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">
                {advisory.location.name} • {advisory.cropType} ({advisory.growthStage})
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight m-0">
              {advisory.diagnosis.issueName}
            </h2>
            <p className="text-sm text-slate-300 italic font-serif m-0">
              Pathogen: {advisory.diagnosis.scientificName} ({advisory.diagnosis.category})
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSaveAdvisory(advisory)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                isSaved
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isSaved ? 'Advisory Saved' : 'Save to History'}
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 hover:scale-105 transition"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Export & Share Report
            </button>
          </div>

        </div>
      </div>

      {/* Voice Player Banner */}
      <VoicePlayer
        voiceScripts={advisory.voiceScript}
        currentLang={currentLang}
        onLangChange={onLangChange}
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'diagnosis'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Bug className="w-4 h-4 text-amber-400" />
          1. Pathology & Microclimate Triggers
        </button>

        <button
          onClick={() => setActiveTab('treatment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'treatment'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-400" />
          2. Step-by-Step Treatment Plan
        </button>

        <button
          onClick={() => setActiveTab('spray')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'spray'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          3. 48-Hour Safe Spray Window
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'impact'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-300" />
          4. Yield Loss & Financial ROI
        </button>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* Tab 1: Pathology & Microclimate Triggers */}
      {activeTab === 'diagnosis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 m-0">
              <Info className="w-4 h-4 text-emerald-400" />
              Agronomic Pathology Breakdown
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {advisory.diagnosis.description}
            </p>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Identified Symptoms:</p>
              <ul className="space-y-1.5 pl-0 list-none">
                {advisory.diagnosis.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-panel-amber rounded-2xl p-6 border border-amber-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 m-0">
              <Droplets className="w-4 h-4 text-amber-400" />
              Live Weather & Microclimate Correlation
            </h3>

            <div className="space-y-2">
              {advisory.diagnosis.microclimateTriggers.map((trigger, i) => (
                <div key={i} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{trigger}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
              <p className="font-bold text-emerald-400">Agronomist Recommendation:</p>
              <p>
                Microclimate conditions currently favor rapid mycelial spore gemination. Immediate foliar intervention within 48 hours is strongly recommended to prevent canopy collapse.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Step-by-Step Treatment Plan */}
      {activeTab === 'treatment' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Immediate Action: Organic & Chemical Options */}
            {advisory.treatment.immediateAction.map((action, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                    action.type === 'Organic' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    OPTION {i + 1}: {action.type.toUpperCase()} REMEDY
                  </span>
                </div>

                <h4 className="text-base font-bold text-white m-0">{action.productName}</h4>
                
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <p className="text-slate-400 font-mono">RECOMMENDED DOSAGE</p>
                  <p className="text-emerald-400 font-bold text-sm mt-0.5">{action.dosage}</p>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-slate-200">Application Method:</p>
                  <p>{action.applicationMethod}</p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <p className="font-bold text-amber-400">Safety Precautions:</p>
                  {action.safetyPrecautions.map((safe, idx) => (
                    <p key={idx}>• {safe}</p>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Soil Nutrition & Preventive Measures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel-emerald rounded-2xl p-6 border border-emerald-500/30 space-y-3">
              <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Soil & Immunity Nutrition Protocol
              </h4>
              <ul className="space-y-2 text-xs text-slate-200 pl-0 list-none">
                {advisory.treatment.soilNutrition.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white m-0 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Long-Term Agronomic Preventive Measures
              </h4>
              <ul className="space-y-2 text-xs text-slate-200 pl-0 list-none">
                {advisory.treatment.preventiveMeasures.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: 48-Hour Safe Spray Window */}
      {activeTab === 'spray' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <SprayWindowChart
            hourlyData={advisory.sprayWindow.hourlyData}
            bestStart={advisory.sprayWindow.bestWindowStart}
            bestEnd={advisory.sprayWindow.bestWindowEnd}
            summary={advisory.sprayWindow.summary}
          />
        </div>
      )}

      {/* Tab 4: Yield Loss & Financial ROI */}
      {activeTab === 'impact' && (
        <ImpactCalculator economicImpact={advisory.economicImpact} />
      )}

      {/* Report Modal */}
      {showExportModal && (
        <ReportExportModal
          advisory={advisory}
          onClose={() => setShowExportModal(false)}
        />
      )}

    </div>
  );
};
