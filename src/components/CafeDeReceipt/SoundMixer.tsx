'use client';

import React from 'react';
import { useAudioMixer, SOUND_LIST, SoundType } from '@/hooks/useAudioMixer';

export default function SoundMixer() {
  const { isPlaying, volumes, togglePlay, changeVolume } = useAudioMixer();

  return (
    <div className="flex flex-col justify-between h-full p-8 bg-amber-950/20 rounded-3xl border border-amber-900/30 backdrop-blur-sm text-amber-100 font-receipt">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2 tracking-wide flex items-center gap-2">
          <span>☕</span> Cafe Ambience
        </h2>
        <p className="text-sm text-amber-300/70 mb-8">
          공간을 채울 완벽한 소리 조합.
        </p>

        <div className="space-y-6">
          {SOUND_LIST.map(({ id, label, maxVolume = 1 }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{label}</span>
                <span className="text-xs text-amber-400/60 font-mono">
                  {Math.round(volumes[id as SoundType] * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={maxVolume}
                step="0.01"
                value={volumes[id as SoundType]}
                onChange={(e) => changeVolume(id as SoundType, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={togglePlay}
        className={`w-full py-4 rounded-2xl font-bold tracking-wider transition-all duration-300 mt-8 cursor-pointer ${
          isPlaying
            ? 'bg-amber-600 hover:bg-amber-500 text-amber-950 shadow-lg shadow-amber-900/40'
            : 'bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 border border-amber-700/40'
        }`}
      >
        {isPlaying ? '⏸ AMBIENCE PAUSE' : '▶ START AMBIENCE'}
      </button>
    </div>
  );
}