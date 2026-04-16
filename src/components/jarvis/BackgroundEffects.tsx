/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function BackgroundEffects() {
  // Track if component is mounted on client
  const [isClient, setIsClient] = useState(false);

  // This is a valid pattern to detect client-side after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate fewer particles only on client-side after mount
  const particles = useMemo(() => {
    if (!isClient) return [];
    
    // Reduced from 20 to 10 particles for better performance
    return Array.from({ length: 10 }, (_, i) => {
      // Use a simple hash function for deterministic but varied values
      const hash1 = ((i * 2654435761) % 10000) / 10000;
      const hash2 = ((i * 2654435761 + 1000) % 10000) / 10000;
      const hash3 = ((i * 2654435761 + 2000) % 10000) / 10000;
      const hash4 = ((i * 2654435761 + 3000) % 10000) / 10000;
      
      return {
        id: i,
        left: (hash1 * 100).toFixed(4),
        duration: (10 + hash2 * 15).toFixed(4), // Slower animations
        delay: (hash3 * 12).toFixed(5),
        size: (1 + hash4 * 2).toFixed(4),
      };
    });
  }, [isClient]);

  return (
    <>
      {/* Aurora Background - Static, no animation */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 20% 20%, rgba(0, 180, 255, 0.02) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at 80% 60%, rgba(0, 150, 255, 0.015) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 50% 80%, rgba(0, 200, 255, 0.015) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Grid Background - Static */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 180, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)'
        }}
      />
      
      {/* Floating Particles - Reduced count */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: 'rgba(0, 180, 255, 0.3)',
              boxShadow: '0 0 3px rgba(0, 180, 255, 0.2)',
              animation: `jarvis-float-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
