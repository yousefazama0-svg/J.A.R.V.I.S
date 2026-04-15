'use client';

import React, { useEffect, useState, useMemo } from 'react';

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only generate particles on client-side to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!mounted) return [];
    
    return Array.from({ length: 20 }, (_, i) => {
      // Use a simple hash function for deterministic but varied values
      const hash1 = ((i * 2654435761) % 10000) / 10000;
      const hash2 = ((i * 2654435761 + 1000) % 10000) / 10000;
      const hash3 = ((i * 2654435761 + 2000) % 10000) / 10000;
      const hash4 = ((i * 2654435761 + 3000) % 10000) / 10000;
      
      return {
        id: i,
        left: (hash1 * 100).toFixed(4),
        duration: (8 + hash2 * 12).toFixed(4),
        delay: (hash3 * 10).toFixed(5),
        size: (1 + hash4 * 2).toFixed(4),
      };
    });
  }, [mounted]);

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
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
