'use client';

import React, { useMemo } from 'react';

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

const MID_NODES = [
  { cx: 86, cy: 50 },
  { cx: 68, cy: 68 },
  { cx: 50, cy: 86 },
  { cx: 32, cy: 68 },
  { cx: 14, cy: 50 },
  { cx: 32, cy: 32 },
];

const INNER_DOTS = [
  { cx: 76, cy: 50 }, { cx: 63, cy: 63 }, { cx: 50, cy: 76 }, { cx: 37, cy: 63 },
  { cx: 24, cy: 50 }, { cx: 37, cy: 37 }, { cx: 50, cy: 24 }, { cx: 63, cy: 37 },
];

/**
 * JARVIS Arc Reactor Logo - Dynamic Animated Edition
 * Professional arc reactor with smooth CSS animations
 */
export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  // Pre-calculate arc paths
  const outerArcs = useMemo(() => 
    [...Array(8)].map((_, i) => {
      const startAngle = (i * 45 - 12) * Math.PI / 180;
      const endAngle = (i * 45 + 12) * Math.PI / 180;
      const r = 44;
      return {
        d: `M ${Math.round(50 + r * Math.cos(startAngle))} ${Math.round(50 + r * Math.sin(startAngle))} A ${r} ${r} 0 0 1 ${Math.round(50 + r * Math.cos(endAngle))} ${Math.round(50 + r * Math.sin(endAngle))}`
      };
    }), []
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer Plasma Field */}
      <div 
        className="absolute rounded-full arc-plasma"
        style={{
          width: size + 20,
          height: size + 20,
          background: 'radial-gradient(circle, rgba(0, 230, 255, 0.35) 0%, rgba(0, 180, 255, 0.15) 40%, transparent 70%)',
          filter: 'blur(3px)'
        }}
      />
      
      {/* Energy Field */}
      <div 
        className="absolute rounded-full arc-energy"
        style={{
          width: size + 10,
          height: size + 10,
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 60%)',
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.6))' }}
      >
        <defs>
          {/* Core Gradient */}
          <radialGradient id="arcCoreGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e0ffff" />
            <stop offset="40%" stopColor="#00ffff" />
            <stop offset="60%" stopColor="#00e5ff" />
            <stop offset="80%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#0097a7" />
          </radialGradient>
          
          {/* Glow Gradient */}
          <radialGradient id="arcGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="35%" stopColor="rgba(0, 255, 255, 0.6)" />
            <stop offset="65%" stopColor="rgba(0, 230, 255, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Ring Gradient */}
          <linearGradient id="arcRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#00bcd4" />
          </linearGradient>
          
          {/* Glow Filter */}
          <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* ========== OUTER RING - Rotating ========== */}
        <g className="arc-ring-outer" style={{ transformOrigin: '50px 50px' }}>
          {/* Outer ring base */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0, 230, 255, 0.3)" strokeWidth="1.5" />
          {/* Outer nodes */}
          {OUTER_NODES.map((node, i) => (
            <circle key={`outer-node-${i}`} cx={node.cx} cy={node.cy} r="2.5" fill="#00e5ff" filter="url(#arcGlow)" />
          ))}
          {/* Connecting arcs */}
          {outerArcs.map((arc, i) => (
            <path key={`outer-arc-${i}`} d={arc.d} fill="none" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1" />
          ))}
        </g>
        
        {/* ========== MID RING - Counter Rotating ========== */}
        <g className="arc-ring-mid" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(0, 230, 255, 0.25)" strokeWidth="1" />
          {/* Mid nodes */}
          {MID_NODES.map((node, i) => (
            <circle key={`mid-node-${i}`} cx={node.cx} cy={node.cy} r="2" fill="rgba(0, 255, 255, 0.85)" filter="url(#arcGlow)" />
          ))}
        </g>
        
        {/* ========== INNER RING - Fast Rotation ========== */}
        <g className="arc-ring-inner" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1.5" filter="url(#arcGlow)" />
          {/* Inner dots */}
          {INNER_DOTS.map((dot, i) => (
            <circle key={`inner-dot-${i}`} cx={dot.cx} cy={dot.cy} r="1.5" fill="rgba(0, 255, 255, 0.9)" />
          ))}
        </g>
        
        {/* ========== CORE FRAME ========== */}
        <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(0, 255, 255, 0.5)" strokeWidth="2" className="arc-core-ring" />
        
        {/* ========== CORE OUTER GLOW ========== */}
        <circle cx="50" cy="50" r="14" fill="url(#arcGlowGrad)" className="arc-core-glow" />
        
        {/* ========== MAIN CORE ========== */}
        <circle cx="50" cy="50" r="10" fill="url(#arcCoreGrad)" className="arc-core" />
        
        {/* ========== CORE CENTER ========== */}
        <circle cx="50" cy="50" r="4" fill="#ffffff" className="arc-center" />
        
        {/* ========== CORE HIGHLIGHT ========== */}
        <circle cx="47" cy="47" r="2" fill="rgba(255, 255, 255, 0.95)" />
        
        {/* ========== ORBITING PARTICLES ========== */}
        <g className="arc-orbit-1" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="50" cy="6" r="2" fill="#ffffff" />
        </g>
        <g className="arc-orbit-2" style={{ transformOrigin: '50px 50px' }}>
          <circle cx="94" cy="50" r="1.5" fill="#ffffff" />
        </g>
      </svg>
      
      {/* Text label if needed */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00e5ff' }}>
            JARVIS
          </span>
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes arc-plasma-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes arc-energy-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes arc-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-rotate-mid {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes arc-rotate-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-core-pulse {
          0%, 100% { opacity: 0.6; stroke-width: 2; }
          50% { opacity: 1; stroke-width: 3; }
        }
        
        @keyframes arc-core-glow-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        
        @keyframes arc-core-main-pulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }
        
        @keyframes arc-center-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        
        @keyframes arc-orbit-1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-orbit-2 {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .arc-plasma {
          animation: arc-plasma-pulse 2.5s ease-in-out infinite;
        }
        
        .arc-energy {
          animation: arc-energy-pulse 2s ease-in-out infinite;
        }
        
        .arc-ring-outer {
          animation: arc-rotate-slow 20s linear infinite;
        }
        
        .arc-ring-mid {
          animation: arc-rotate-mid 15s linear infinite;
        }
        
        .arc-ring-inner {
          animation: arc-rotate-fast 10s linear infinite;
        }
        
        .arc-core-ring {
          animation: arc-core-pulse 1.8s ease-in-out infinite;
        }
        
        .arc-core-glow {
          animation: arc-core-glow-pulse 2s ease-in-out infinite;
        }
        
        .arc-core {
          animation: arc-core-main-pulse 1.5s ease-in-out infinite;
        }
        
        .arc-center {
          animation: arc-center-pulse 1s ease-in-out infinite;
        }
        
        .arc-orbit-1 {
          animation: arc-orbit-1 5s linear infinite;
        }
        
        .arc-orbit-2 {
          animation: arc-orbit-2 7s linear infinite;
        }
      `}</style>
    </div>
  );
}
