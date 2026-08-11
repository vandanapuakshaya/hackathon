import React from 'react';
import { X, History, Trash2, ChevronRight, Sprout, Clock } from 'lucide-react';
import type { AdvisoryPlan } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedAdvisories: AdvisoryPlan[];
  onSelectAdvisory: (adv: AdvisoryPlan) => void;
  onDeleteAdvisory: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedAdvisories,
  onSelectAdvisory,
  onDeleteAdvisory,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 space-y-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white m-0">Saved Agronomic Field Scans</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of saved advisories */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedAdvisories.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Sprout className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No saved field advisories yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Run a diagnostic scan in the Field Scanner and click "Save to History" to store reports for offline review.
              </p>
            </div>
          ) : (
            savedAdvisories.map((adv) => (
              <div
                key={adv.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition space-y-2 group relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {adv.cropType} • {adv.diagnosis.issueName}
                  </span>
                  <button
                    onClick={() => onDeleteAdvisory(adv.id)}
                    className="text-slate-500 hover:text-red-400 transition p-1"
                    title="Delete saved report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  onClick={() => {
                    onSelectAdvisory(adv);
                    onClose();
                  }}
                  className="cursor-pointer space-y-1"
                >
                  <p className="text-xs text-slate-300 font-medium">{adv.location.name}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Saved: {adv.timestamp}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px]">
                    <span className="text-amber-400 font-mono">
                      Safe Window: {adv.sprayWindow.bestWindowStart} - {adv.sprayWindow.bestWindowEnd}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition">
                      View Report <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedAdvisories.length > 0 && (
          <div className="border-t border-slate-800 pt-4">
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Saved Records
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
