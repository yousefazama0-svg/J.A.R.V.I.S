'use client';

import React, { useEffect, useState } from 'react';

// Deterministic pseudo-random function based on index (same result on server & client)
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Format number to fixed decimal places for consistent string representation
const formatNumber = (num: number, decimals: number = 4): string => {
  return num.toFixed(decimals);
};

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-generate deterministic particles with fixed decimal precision
  // This ensures server and client generate identical values
  const particles = Array.from({ length: 20 }, (_, i) => {
    const leftVal = seededRandom(i) * 100;
    const durationVal = 8 + seededRandom(i + 100) * 12;
    const delayVal = seededRandom(i + 200) * 10;
    const sizeVal = 1 + seededRandom(i + 300) * 2;
    
    return {
      id: i,
      left: `${formatNumber(leftVal, 4)}%`,
      duration: `${formatNumber(durationVal, 4)}s`,
      delay: `${formatNumber(delayVal, 5)}s`,
      size: formatNumber(sizeVal, 4),
    };
  });

  return (
    <>
      <div className="jarvis-aurora" />
      <div className="jarvis-grid-bg" />
      <div className="jarvis-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="jarvis-particle"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: 0, // Always start at 0, animate via CSS
            }}
          />
        ))}
      </div>
    </>
  );
}
