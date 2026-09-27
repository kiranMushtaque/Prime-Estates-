import React, { useEffect, useState } from 'react';
import { WALKTHROUGH_ROOMS } from '../data/realEstateData';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const imagesToLoad = WALKTHROUGH_ROOMS.map((r) => r.image);
    const total = imagesToLoad.length;
    let completed = 0;

    const handleItemLoaded = () => {
      completed += 1;
      setLoadedCount(completed);
      const targetPercent = Math.round((completed / total) * 100);
      setProgress(targetPercent);

      if (completed >= total) {
        setTimeout(() => {
          setIsDone(true);
          onLoaded?.();
        }, 500);
      }
    };

    // Preload each image with browser Image objects
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.onload = handleItemLoaded;
      img.onerror = handleItemLoaded; // Ensure we never hang on network error
      img.src = src;
    });

    // Fallback safety timeout so user is never stuck
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsDone(true);
        onLoaded?.();
      }, 400);
    }, 4000);

    return () => clearTimeout(safetyTimeout);
  }, [onLoaded]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] text-white transition-opacity duration-700 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle luxury background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Monogram / Brand mark */}
        <div className="w-16 h-16 mb-6 rounded-full border border-[#C9A24B]/40 flex items-center justify-center relative shadow-[0_0_35px_rgba(201,162,75,0.25)]">
          <div className="w-12 h-12 rounded-full border border-[#C9A24B]/70 flex items-center justify-center">
            <span className="font-serif text-xl tracking-wider text-[#C9A24B] font-bold">M</span>
          </div>
          <div
            className="absolute inset-0 rounded-full border-t-2 border-[#C9A24B] animate-spin"
            style={{ animationDuration: '2s' }}
          />
        </div>

        <h2 className="font-serif text-2xl tracking-widest uppercase text-white mb-1">
          MERIDIAN ESTATES
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] mb-8 font-medium">
          AZURE BAY CINEMATIC RESIDENCES
        </p>

        {/* Progress bar */}
        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#8C6D2B] via-[#C9A24B] to-[#FFE082] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-64 text-[11px] text-stone-400 font-mono">
          <span>PRELOADING HIGH-RES SPACES ({loadedCount}/7)</span>
          <span className="text-[#C9A24B] tabular-nums">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
