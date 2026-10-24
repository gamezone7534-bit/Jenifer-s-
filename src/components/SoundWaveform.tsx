import React from 'react';

interface SoundWaveformProps {
  isActive: boolean;
  barCount?: number;
  height?: number;
}

export const SoundWaveform: React.FC<SoundWaveformProps> = ({
  isActive,
  barCount = 18,
  height = 36,
}) => {
  return (
    <div
      className="flex items-center justify-center gap-1.5 px-3 py-1.5"
      style={{ height: `${height}px` }}
      aria-label="Sound waveform visualizer"
    >
      {Array.from({ length: barCount }).map((_, i) => {
        // Pseudo-random animation delays and scales for realistic sound dynamics
        const animDelay = (i * 0.08) % 0.8;
        const animDuration = 0.45 + ((i % 4) * 0.15);

        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-t from-cyan-400 via-indigo-400 to-purple-400'
                : 'bg-slate-700/60'
            }`}
            style={{
              height: isActive ? `${Math.max(15, 20 + ((i * 17) % 80))}%` : '15%',
              animationName: isActive ? 'waveBounce' : 'none',
              animationDuration: `${animDuration}s`,
              animationTimingFunction: 'ease-in-out',
              animationDelay: `${animDelay.toFixed(2)}s`,
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
            }}
          />
        );
      })}
    </div>
  );
};
