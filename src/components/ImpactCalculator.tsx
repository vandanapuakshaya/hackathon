import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, DollarSign, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ImpactCalculatorProps {
  economicImpact: {
    untreatedYieldLossPercent: number;
    treatedYieldLossPercent: number;
    estimatedLossWithoutTreatment: number;
    treatmentCostPerAcre: number;
    netSavingsPerAcre: number;
    roiRatio: number;
  };
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ economicImpact }) => {
  const chartData = [
    {
      name: 'No Treatment',
      lossPercent: economicImpact.untreatedYieldLossPercent,
      color: '#ef4444' // Red
    },
    {
      name: 'Recommended Treatment',
      lossPercent: economicImpact.treatedYieldLossPercent,
      color: '#10b981' // Green
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top ROI KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Saved Value per Acre */}
        <div className="glass-panel-emerald rounded-xl p-4 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-300 font-medium">Estimated Crop Value Saved</p>
            <p className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
              ${economicImpact.netSavingsPerAcre} <span className="text-xs font-normal text-slate-400">/ acre</span>
            </p>
            <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              Net protection after remedy cost
            </p>
          </div>
        </div>

        {/* Treatment ROI Ratio */}
        <div className="glass-panel-amber rounded-xl p-4 border border-amber-500/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-300 font-medium">Agronomic ROI Ratio</p>
            <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {economicImpact.roiRatio}x <span className="text-xs font-normal text-slate-400">Return</span>
            </p>
            <p className="text-[10px] text-amber-400 mt-0.5">
              Every $1 spent saves ${economicImpact.roiRatio} crop yield
            </p>
          </div>
        </div>

        {/* Remedy Cost breakdown */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-300 font-medium">Remediation Investment</p>
            <p className="text-2xl font-black text-slate-100 font-mono mt-0.5">
              ${economicImpact.treatmentCostPerAcre} <span className="text-xs font-normal text-slate-400">/ acre</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Includes bio-fungicide & labor</p>
          </div>
        </div>

      </div>

      {/* Yield Loss Bar Comparison Chart */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Yield Loss Impact Comparison (%)
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            +{economicImpact.untreatedYieldLossPercent - economicImpact.treatedYieldLossPercent}% Yield Retention
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 11 }} width={140} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs">
                        <p className="font-bold text-white">{data.name}</p>
                        <p className="text-slate-300">Projected Yield Loss: <span className="font-bold text-amber-400">{data.lossPercent}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="lossPercent" radius={[0, 8, 8, 0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
