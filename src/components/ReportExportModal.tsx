import React from 'react';
import { X, Printer, Share2, Check, Sprout, QrCode } from 'lucide-react';
import type { AdvisoryPlan } from '../types';

interface ReportExportModalProps {
  advisory: AdvisoryPlan;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ advisory, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    const text = `🌱 *AGRISHIELD AI FIELD ADVISORY* 🌱\n` +
      `📍 *Location:* ${advisory.location.name}\n` +
      `🌾 *Crop:* ${advisory.cropType} (${advisory.growthStage})\n` +
      `⚠️ *Diagnosis:* ${advisory.diagnosis.issueName} (${advisory.diagnosis.confidence.toFixed(1)}% Confidence)\n` +
      `🧪 *Treatment:* ${advisory.treatment.immediateAction[0]?.productName} (${advisory.treatment.immediateAction[0]?.dosage})\n` +
      `⏰ *Safe Spray Window:* ${advisory.sprayWindow.bestWindowStart} - ${advisory.sprayWindow.bestWindowEnd} (Tomorrow)\n` +
      `💰 *Yield Value Saved:* $${advisory.economicImpact.netSavingsPerAcre}/acre (ROI: ${advisory.economicImpact.roiRatio}x)\n` +
      `Generated via AgriShield AI Platform`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Card Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white m-0">Official Agronomic Field Advisory Report</h3>
              <p className="text-xs text-slate-400 m-0">ID: {advisory.id} • Issued: {advisory.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Advisory Details Grid */}
        <div className="space-y-4 text-slate-200 text-xs">
          
          {/* Location & Crop */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <p className="text-slate-400 font-mono">FARM LOCATION</p>
              <p className="font-bold text-white mt-0.5">{advisory.location.name}, {advisory.location.country}</p>
            </div>
            <div>
              <p className="text-slate-400 font-mono">CROP & STAGE</p>
              <p className="font-bold text-emerald-400 mt-0.5">{advisory.cropType} ({advisory.growthStage})</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
            <p className="text-amber-400 font-bold font-mono">DIAGNOSIS & SEVERITY</p>
            <p className="text-sm font-extrabold text-white">{advisory.diagnosis.issueName} ({advisory.diagnosis.severity})</p>
            <p className="text-slate-300 italic">{advisory.diagnosis.description}</p>
          </div>

          {/* Treatment & Spray Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <p className="text-emerald-400 font-bold font-mono">RECOMMENDED REMEDY</p>
              <p className="font-bold text-white">{advisory.treatment.immediateAction[0]?.productName}</p>
              <p className="text-slate-300">Dosage: {advisory.treatment.immediateAction[0]?.dosage}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <p className="text-cyan-400 font-bold font-mono">SAFE SPRAY WINDOW</p>
              <p className="font-extrabold text-emerald-300 font-mono text-sm">
                {advisory.sprayWindow.bestWindowStart} - {advisory.sprayWindow.bestWindowEnd} (Tomorrow)
              </p>
              <p className="text-slate-300">Wind: Low drift • 0% Rain probability</p>
            </div>
          </div>

          {/* Financial ROI */}
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-bold font-mono">NET SAVED CROP VALUE</p>
              <p className="text-lg font-black text-emerald-300 font-mono">${advisory.economicImpact.netSavingsPerAcre} / acre</p>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-slate-400 opacity-60" />
              <div className="text-[10px] text-slate-400 font-mono text-right">
                <p>VERIFIED</p>
                <p className="text-emerald-400 font-bold">AGRISHIELD</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopyWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
          >
            {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied WhatsApp Advisory!' : 'Copy WhatsApp Advisory'}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print / Save PDF
          </button>
        </div>

      </div>
    </div>
  );
};
