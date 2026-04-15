'use client';

import React, { useEffect, useState } from 'react';

export default function ArcReactor() {
  const [isHovered, setIsHovered] = useState(false);
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(prev => {
        const newIntensity = prev + (Math.random() - 0.5) * 0.2;
        return Math.max(0.7, Math.min(1.3, newIntensity));
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-[400px] h-[400px] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle, rgba(0, 180, 255, ${0.3 * intensity}) 0%, transparent 70%)`,
          transform: `scale(${isHovered ? 1.3 : 1.2})`,
          opacity: isHovered ? 1 : 0.7
        }}
      />

      {/* Main SVG Container */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full"
        style={{ filter: `drop-shadow(0 0 20px rgba(0, 212, 255, ${0.5 * intensity}))` }}
      >
        <defs>
          {/* Core Glow Gradient */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#c8f0ff" stopOpacity="1" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0096ff" stopOpacity="0" />
          </radialGradient>

          {/* Ring Gradients */}
          <linearGradient id="ring1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#00b4ff" />
            <stop offset="100%" stopColor="#0096ff" />
          </linearGradient>

          <linearGradient id="ring2Gradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00b4ff" />
            <stop offset="50%" stopColor="#0096ff" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong Glow Filter */}
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle */}
          <circle id="particle" r="2" fill="#00d4ff" />
        </defs>

        {/* Outer Decorative Ring - Static */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="rgba(0, 150, 255, 0.1)"
          strokeWidth="2"
        />

        {/* Outermost Rotating Ring */}
        <g className="origin-center" style={{ animation: 'rotateOuter 30s linear infinite' }}>
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="url(#ring1Gradient)"
            strokeWidth="1"
            strokeDasharray="10 5"
            opacity="0.5"
          />
          
          {/* Outer Arc Segments */}
          {[...Array(12)].map((_, i) => (
            <path
              key={`outer-segment-${i}`}
              d={`M ${200 + 160 * Math.cos((i * 30 - 75) * Math.PI / 180)} ${200 + 160 * Math.sin((i * 30 - 75) * Math.PI / 180)} A 160 160 0 0 1 ${200 + 160 * Math.cos((i * 30 - 45) * Math.PI / 180)} ${200 + 160 * Math.sin((i * 30 - 45) * Math.PI / 180)}`}
              fill="none"
              stroke="url(#ring1Gradient)"
              strokeWidth="2"
              filter="url(#glow)"
              style={{ opacity: 0.6 + 0.4 * Math.sin(Date.now() / 500 + i) }}
            />
          ))}
        </g>

        {/* Third Rotating Ring - Counter Clockwise */}
        <g className="origin-center" style={{ animation: 'rotateReverse 20s linear infinite' }}>
          {/* Triangle Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`triangle-${i}`}
              d={`M ${200 + 140 * Math.cos((i * 36) * Math.PI / 180)} ${200 + 140 * Math.sin((i * 36) * Math.PI / 180)} L ${200 + 120 * Math.cos((i * 36 + 15) * Math.PI / 180)} ${200 + 120 * Math.sin((i * 36 + 15) * Math.PI / 180)} L ${200 + 120 * Math.cos((i * 36 - 15) * Math.PI / 180)} ${200 + 120 * Math.sin((i * 36 - 15) * Math.PI / 180)} Z`}
              fill="none"
              stroke="url(#ring2Gradient)"
              strokeWidth="1.5"
              filter="url(#glow)"
              style={{
                opacity: intensity * (0.7 + 0.3 * Math.sin(Date.now() / 300 + i * 0.5))
              }}
            />
          ))}
        </g>

        {/* Second Rotating Ring */}
        <g className="origin-center" style={{ animation: 'rotateMiddle 15s linear infinite' }}>
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="url(#ring1Gradient)"
            strokeWidth="4"
            strokeDasharray="20 10"
            filter="url(#glow)"
          />
          
          {/* Energy Arcs */}
          {[...Array(6)].map((_, i) => (
            <path
              key={`arc-${i}`}
              d={`M ${200 + 95 * Math.cos((i * 60) * Math.PI / 180)} ${200 + 95 * Math.sin((i * 60) * Math.PI / 180)} A 95 95 0 0 1 ${200 + 95 * Math.cos((i * 60 + 40) * Math.PI / 180)} ${200 + 95 * Math.sin((i * 60 + 40) * Math.PI / 180)}`}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="3"
              filter="url(#glow)"
              opacity={0.8}
            />
          ))}
        </g>

        {/* Inner Rotating Ring */}
        <g className="origin-center" style={{ animation: 'rotateInner 10s linear infinite' }}>
          <circle
            cx="200"
            cy="200"
            r="70"
            fill="none"
            stroke="url(#ring2Gradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Inner Triangle Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`inner-triangle-${i}`}
              d={`M ${200 + 70 * Math.cos((i * 36) * Math.PI / 180)} ${200 + 70 * Math.sin((i * 36) * Math.PI / 180)} L ${200 + 55 * Math.cos((i * 36 + 12) * Math.PI / 180)} ${200 + 55 * Math.sin((i * 36 + 12) * Math.PI / 180)} L ${200 + 55 * Math.cos((i * 36 - 12) * Math.PI / 180)} ${200 + 55 * Math.sin((i * 36 - 12) * Math.PI / 180)} Z`}
              fill="rgba(0, 212, 255, 0.3)"
              stroke="#00d4ff"
              strokeWidth="1"
              filter="url(#glow)"
              style={{
                opacity: 0.6 + 0.4 * Math.sin(Date.now() / 400 + i)
              }}
            />
          ))}
        </g>

        {/* Inner Glow Ring */}
        <circle
          cx="200"
          cy="200"
          r="50"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          opacity="0.5"
          filter="url(#glow)"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />

        {/* Central Core */}
        <g style={{ filter: 'url(#strongGlow)' }}>
          <circle
            cx="200"
            cy="200"
            r="35"
            fill="url(#coreGlow)"
            style={{
              animation: 'corePulse 1.5s ease-in-out infinite',
              transform: `scale(${intensity})`,
              transformOrigin: 'center'
            }}
          />
        </g>

        {/* Inner Core Brightness */}
        <circle
          cx="200"
          cy="200"
          r="20"
          fill="#ffffff"
          filter="url(#strongGlow)"
          style={{ animation: 'pulse 1s ease-in-out infinite' }}
        />

        {/* Central Dot */}
        <circle
          cx="200"
          cy="200"
          r="8"
          fill="#ffffff"
          filter="url(#strongGlow)"
        />

        {/* Energy Particles */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={`particle-${i}`}
            r="1.5"
            fill="#00d4ff"
            filter="url(#glow)"
            style={{
              animation: `particle${i % 5} ${3 + i * 0.2}s linear infinite`,
              transformOrigin: 'center'
            }}
          />
        ))}
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rotateOuter {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes rotateMiddle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotateInner {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes corePulse {
          0%, 100% { 
            opacity: 0.9;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.08);
          }
        }
        
        @keyframes particle0 {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes particle1 {
          0% { transform: rotate(72deg) translateX(100px) rotate(-72deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotate(432deg) translateX(100px) rotate(-432deg); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: rotate(144deg) translateX(80px) rotate(-144deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotate(504deg) translateX(80px) rotate(-504deg); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: rotate(216deg) translateX(140px) rotate(-216deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotate(576deg) translateX(140px) rotate(-576deg); opacity: 0; }
        }
        
        @keyframes particle4 {
          0% { transform: rotate(288deg) translateX(110px) rotate(-288deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotate(648deg) translateX(110px) rotate(-648deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
