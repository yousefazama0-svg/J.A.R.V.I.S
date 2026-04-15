'use client';

import React, { useState, useEffect } from 'react';

// Deterministic pseudo-random function based on index
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use deterministic values based on index to avoid hydration mismatch
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${seededRandom(i) * 100}%`,
    duration: `${8 + seededRandom(i + 100) * 12}s`,
    delay: `${seededRandom(i + 200) * 10}s`,
    size: 1 + seededRandom(i + 300) * 2,
  }));

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
              opacity: mounted ? 1 : 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
