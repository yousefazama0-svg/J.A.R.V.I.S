'use client';

import React, { useMemo } from 'react';

export default function BackgroundEffects() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${8 + Math.random() * 12}s`,
      delay: `${Math.random() * 10}s`,
      size: 1 + Math.random() * 2,
    })),
  []);

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
            }}
          />
        ))}
      </div>
    </>
  );
}
