import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, MapPin, Radio, Layers, Sprout } from 'lucide-react';
import { MOCK_OUTBREAK_ALERTS } from '../data/mockOutbreaks';
import type { OutbreakAlert, GeoLocation } from '../types';

interface ClimateMapProps {
  location: GeoLocation;
}

export const ClimateMap: React.FC<ClimateMapProps> = ({ location }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<OutbreakAlert | null>(MOCK_OUTBREAK_ALERTS[0]);

  // Draw interactive radar & outbreak map canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseRadius = 0;

    const renderMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Dark Map Canvas Grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center: User Farm Location
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Radar Concentric Circles around Farm
      [60, 120, 180].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Animated Pulse Ring
      pulseRadius = (pulseRadius + 0.8) % 180;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${1 - pulseRadius / 180})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw User Farm Dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label User Farm
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`YOUR FARM (${location.name})`, centerX - 50, centerY - 14);

      // Draw Nearby Outbreak Markers
      MOCK_OUTBREAK_ALERTS.forEach((alert, index) => {
        // Map offset based on coords
        const angle = index * (Math.PI / 2.5) + 0.5;
        const dist = 45 + alert.distanceKm * 3.5;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        const isSelected = selectedAlert?.id === alert.id;

        // Draw Alert Circle
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 9 : 6, 0, Math.PI * 2);
        ctx.fillStyle = alert.severity === 'High' ? '#ef4444' : '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Draw Line connecting to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = alert.severity === 'High' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${alert.disease} (${alert.distanceKm}km)`, x + 10, y + 4);
      });

      animationFrameId = requestAnimationFrame(renderMap);
    };

    renderMap();

    return () => cancelAnimationFrame(animationFrameId);
  }, [location, selectedAlert]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel-amber rounded-3xl p-6 border border-amber-500/40 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Community Pest & Outbreak Early Warning Network
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight m-0">
          Regional Outbreak Radar & Climate Resilience Map
        </h2>
        <p className="text-sm text-slate-300">
          Real-time spatial tracking of disease outbreaks in your 50km agricultural radius paired with 14-day microclimate vulnerability forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Map Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Live Agricultural Outbreak Radar (50km Radius)
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                5 ACTIVE NEARBY REPORTS
              </span>
            </div>

            {/* Interactive Canvas */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-800">
              <canvas
                ref={canvasRef}
                width={650}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 14-Day Microclimate Vulnerability Index */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              14-Day Climate Risk Index & Vulnerability Forecast
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-red-500/30">
                <div className="flex items-center justify-between text-xs text-red-400 font-bold">
                  <span>Fungal Spore Risk</span>
                  <span>88% HIGH</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-red-500 h-full w-[88%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Humid canopy dew favor spore germination</p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>Pest Migration Risk</span>
                  <span>62% MOD</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[62%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Southwest wind currents carrying moth vectors</p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Drought Stress Index</span>
                  <span>14% LOW</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[14%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Optimal soil moisture levels stored</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Feed & Climate-Resilient Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Outbreak Alerts Feed */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Verified Community Outbreak Feed
            </span>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {MOCK_OUTBREAK_ALERTS.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      isSelected
                        ? 'bg-red-950/70 border-red-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{alert.disease}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        alert.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {alert.severity.toUpperCase()} • {alert.distanceKm} km away
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1">
                      Reported in {alert.locationName} ({alert.casesCount} farm reports • {alert.reportedDate})
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Climate-Resilient Variety Recommendations */}
          <div className="glass-panel-emerald rounded-2xl p-5 border border-emerald-500/30 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              Climate-Resilient Cultivar Recommendations
            </span>

            <div className="space-y-2 text-xs text-slate-200">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <p className="font-bold text-emerald-300">Wheat: HD-3226 (Kedarnath Strain)</p>
                <p className="text-slate-400 mt-0.5">High resistance to Stripe Rust & leaf blight; 12% lower water requirement.</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <p className="font-bold text-emerald-300">Maize: KATEH-Hybrid 442</p>
                <p className="text-slate-400 mt-0.5">Thick leaf husk structure protects against Fall Armyworm egg laying.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
