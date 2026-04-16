'use client';

import React from 'react';

interface ArcReactorLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

// Pre-calculated positions to avoid hydration mismatch
const OUTER_NODES = [
  { cx: 94, cy: 50 },
  { cx: 81, cy: 81 },
  { cx: 50, cy: 94 },
  { cx: 19, cy: 81 },
  { cx: 6, cy: 50 },
  { cx: 19, cy: 19 },
  { cx: 50, cy: 6 },
  { cx: 81, cy: 19 },
];

const INNER_DOTS = [
  { cx: 76, cy: 50 }, { cx: 63, cy: 63 }, { cx: 50, cy: 76 }, { cx: 37, cy: 63 },
  { cx: 24, cy: 50 }, { cx: 37, cy: 37 }, { cx: 50, cy: 24 }, { cx: 63, cy: 37 },
];

/**
 * JARVIS Arc Reactor Logo - Optimized Edition
 * Lightweight version with CSS-based animations for better performance
 */
export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer Plasma Field - CSS only */}
      <div 
        className="absolute rounded-full arc-plasma"
        style={{
          width: size + 16,
          height: size + 16,
          background: 'radial-gradient(circle, rgba(0, 230, 255, 0.25) 0%, transparent 70%)',
        }}
      />
      
      {/* Main SVG Reactor - Simplified */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.5))' }}
      >
        <defs>
          {/* Core Gradient */}
          <radialGradient id="arcCoreGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00ffff" />
            <stop offset="70%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#0097a7" />
          </radialGradient>
          
          {/* Ring Gradient */}
          <linearGradient id="arcRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#00bcd4" />
          </linearGradient>
        </defs>
        
        {/* Outer Ring - Single rotation */}
        <g className="arc-ring-outer" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0, 230, 255, 0.4)" strokeWidth="1.5" />
          {OUTER_NODES.map((node, i) => (
            <circle key={`outer-${i}`} cx={node.cx} cy={node.cy} r="2.5" fill="#00e5ff" />
          ))}
        </g>
        
        {/* Inner Ring - Counter rotation */}
        <g className="arc-ring-inner" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
          {INNER_DOTS.map((dot, i) => (
            <circle key={`inner-${i}`} cx={dot.cx} cy={dot.cy} r="1.5" fill="rgba(0, 255, 255, 0.9)" />
          ))}
        </g>
        
        {/* Core Frame */}
        <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(0, 255, 255, 0.5)" strokeWidth="2" />
        
        {/* Main Core */}
        <circle cx="50" cy="50" r="10" fill="url(#arcCoreGrad)" className="arc-core" />
        
        {/* Core Center */}
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
        
        {/* Core Highlight */}
        <circle cx="48" cy="48" r="1.5" fill="rgba(255, 255, 255, 0.9)" />
      </svg>
      
      {/* Text label if needed */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00e5ff' }}>
            JARVIS
          </span>
        </div>
      )}
      
      {/* Embedded CSS Animations - Minimal */}
      <style jsx>{`
        @keyframes arc-plasma-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        
        @keyframes arc-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-rotate-fast {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes arc-core-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        
        .arc-plasma {
          animation: arc-plasma-pulse 3s ease-in-out infinite;
        }
        
        .arc-ring-outer {
          animation: arc-rotate-slow 15s linear infinite;
        }
        
        .arc-ring-inner {
          animation: arc-rotate-fast 8s linear infinite;
        }
        
        .arc-core {
          animation: arc-core-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
