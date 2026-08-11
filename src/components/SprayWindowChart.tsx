import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { HourlyWeatherForecast } from '../types';
import { Clock } from 'lucide-react';

interface SprayWindowChartProps {
  hourlyData: HourlyWeatherForecast[];
  bestStart: string;
  bestEnd: string;
  summary: string;
}

export const SprayWindowChart: React.FC<SprayWindowChartProps> = ({
  hourlyData,
  bestStart,
  bestEnd,
  summary
}) => {
  return (
    <div className="space-y-4">
      
      {/* Top Advisory Banner for Spray Window */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/50 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white m-0">Recommended Safe Spray Window</h4>
              <span className="text-[10px] font-mono font-bold bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                NEXT 24 HOURS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 m-0">{summary}</p>
          </div>
        </div>

        <div className="bg-emerald-950 border border-emerald-500/40 px-4 py-2 rounded-xl text-center shrink-0">
          <p className="text-[10px] text-emerald-400 font-mono uppercase">Optimal Time Frame</p>
          <p className="text-base font-extrabold text-emerald-300 font-mono">{bestStart} - {bestEnd}</p>
        </div>
      </div>

      {/* Hourly Matrix Chart using Recharts */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="safetyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as HourlyWeatherForecast;
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <p className="font-bold text-amber-400 font-mono">{data.time} Forecast</p>
                      <p className="text-slate-200">Safety Index: <span className="font-bold text-emerald-400">{data.spraySafetyScore}/100</span> ({data.spraySafetyLevel})</p>
                      <p className="text-slate-300">Wind Speed: <span className="text-cyan-400">{data.windSpeed} km/h</span></p>
                      <p className="text-slate-300">Rain Prob: <span className="text-blue-400">{data.rainProbability}%</span></p>
                      {data.hazardReason && (
                        <p className="text-red-400 font-semibold mt-1 border-t border-slate-800 pt-1 text-[11px]">
                          ⚠️ {data.hazardReason}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Safety Score Area */}
            <Area type="monotone" dataKey="spraySafetyScore" name="Spray Safety Index" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#safetyGrad)" />
            {/* Wind speed line */}
            <Area type="monotone" dataKey="windSpeed" name="Wind Speed (km/h)" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#windGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Status Strip */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
        {hourlyData.slice(0, 12).map((h, i) => (
          <div
            key={i}
            className={`p-1.5 rounded-lg border text-center font-mono ${
              h.spraySafetyLevel === 'OPTIMAL'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : h.spraySafetyLevel === 'SUB_OPTIMAL'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-red-950/60 border-red-500/40 text-red-300'
            }`}
          >
            <p className="text-[10px] text-slate-400">{h.time}</p>
            <p className="text-[11px] font-bold mt-0.5">{h.spraySafetyScore}%</p>
          </div>
        ))}
      </div>

    </div>
  );
};
