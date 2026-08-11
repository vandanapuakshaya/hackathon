import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import type { Language } from '../types';

interface VoicePlayerProps {
  voiceScripts: Record<Language, string>;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  voiceScripts,
  currentLang,
  onLangChange
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop existing

      const text = voiceScripts[currentLang] || voiceScripts.en;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = rate;

      // Set voice language code if available
      const langCodes: Record<Language, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        sw: 'sw-KE',
        es: 'es-ES',
        pa: 'pa-IN'
      };
      utterance.lang = langCodes[currentLang] || 'en-US';

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const activeScriptText = voiceScripts[currentLang] || voiceScripts.en;

  return (
    <div className="glass-panel-emerald rounded-2xl p-5 border border-emerald-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white m-0">Farmer Audio Voice Advisory</h4>
            <p className="text-[11px] text-slate-300 m-0">Spoken read-out for accessible field guidance</p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Language picker */}
          <select
            value={currentLang}
            onChange={(e) => onLangChange(e.target.value as Language)}
            className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="en">🇬🇧 EN</option>
            <option value="hi">🇮🇳 HI</option>
            <option value="sw">🇰🇪 SW</option>
            <option value="es">🇪🇸 ES</option>
            <option value="pa">🇮🇳 PA</option>
          </select>

          {/* Rate Selector */}
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 px-2 py-1.5 rounded-lg focus:outline-none"
          >
            <option value={0.8}>0.8x Speed</option>
            <option value={1.0}>1.0x Normal</option>
            <option value={1.2}>1.2x Fast</option>
          </select>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-950/60'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-950/60'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Speech
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                Play Audio Readout
              </>
            )}
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              title="Stop Speech"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Waveform graphic when playing */}
      {isPlaying && (
        <div className="flex items-center justify-center gap-1 py-2">
          <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="w-1 h-8 bg-amber-400 rounded-full animate-pulse delay-75"></span>
          <span className="w-1 h-10 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
          <span className="w-1 h-6 bg-cyan-400 rounded-full animate-pulse delay-100"></span>
          <span className="w-1 h-9 bg-emerald-400 rounded-full animate-pulse delay-200"></span>
          <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse"></span>
        </div>
      )}

      {/* Spoken Text Transcript Box */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
        <p className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center justify-between">
          <span>TRANSCRIPT ({currentLang.toUpperCase()})</span>
          {!isSupported && <span className="text-amber-400">Audio playback emulated in browser</span>}
        </p>
        <p className="text-xs text-slate-200 leading-relaxed m-0 italic font-serif">
          "{activeScriptText}"
        </p>
      </div>

    </div>
  );
};
