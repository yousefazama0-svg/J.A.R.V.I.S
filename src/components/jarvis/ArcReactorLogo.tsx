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
  { cx: 72, cy: 57 }, { cx: 57, cy: 72 }, { cx: 43, cy: 72 }, { cx: 28, cy: 57 },
];

/**
 * JARVIS Arc Reactor Logo - Advanced Tech Edition
 * A stunning, futuristic arc reactor with dynamic animations
 * Inspired by Stark Industries technology
 */
export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  // Memoize arc paths to avoid recalculation
  const outerArcs = useMemo(() => 
    [...Array(8)].map((_, i) => {
      const startAngle = (i * 45 - 10) * Math.PI / 180;
      const endAngle = (i * 45 + 10) * Math.PI / 180;
      const r = 44;
      return {
        d: `M ${Math.round(50 + r * Math.cos(startAngle))} ${Math.round(50 + r * Math.sin(startAngle))} A ${r} ${r} 0 0 1 ${Math.round(50 + r * Math.cos(endAngle))} ${Math.round(50 + r * Math.sin(endAngle))}`
      };
    }), []
  );
  
  const midArcs = useMemo(() =>
    [...Array(6)].map((_, i) => {
      const startAngle = (i * 60 + 15) * Math.PI / 180;
      const endAngle = (i * 60 + 45) * Math.PI / 180;
      const r = 36;
      return {
        d: `M ${Math.round(50 + r * Math.cos(startAngle))} ${Math.round(50 + r * Math.sin(startAngle))} A ${r} ${r} 0 0 1 ${Math.round(50 + r * Math.cos(endAngle))} ${Math.round(50 + r * Math.sin(endAngle))}`
      };
    }), []
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer Plasma Field */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 20,
          height: size + 20,
          background: 'radial-gradient(circle, rgba(0, 230, 255, 0.35) 0%, rgba(0, 180, 255, 0.15) 40%, transparent 70%)',
          animation: 'logo-plasma-pulse 2.5s ease-in-out infinite',
          filter: 'blur(4px)'
        }}
      />
      
      {/* Energy Field */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 10,
          height: size + 10,
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.25) 0%, transparent 60%)',
          animation: 'logo-energy-field 2s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.7))' }}
      >
        <defs>
          {/* Core Gradient */}
          <radialGradient id="logoCoreGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e0ffff" />
            <stop offset="40%" stopColor="#00ffff" />
            <stop offset="60%" stopColor="#00e5ff" />
            <stop offset="80%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#0097a7" />
          </radialGradient>
          
          {/* Glow Gradient */}
          <radialGradient id="logoGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="35%" stopColor="rgba(0, 255, 255, 0.7)" />
            <stop offset="65%" stopColor="rgba(0, 230, 255, 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Ring Gradient */}
          <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#00bcd4" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="logoGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="logoStrongGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* ========== OUTER RING - Rotating Segments ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-slow 20s linear infinite' }}>
          {/* Outer ring segments */}
          {OUTER_NODES.map((node, i) => (
            <circle
              key={`outer-seg-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="3"
              fill="none"
              stroke="url(#logoRingGrad)"
              strokeWidth="1.5"
              filter="url(#logoGlow)"
              style={{ opacity: 0.8 }}
            />
          ))}
          {/* Connecting arcs */}
          {outerArcs.map((arc, i) => (
            <path
              key={`outer-arc-${i}`}
              d={arc.d}
              fill="none"
              stroke="rgba(0, 240, 255, 0.6)"
              strokeWidth="1"
              filter="url(#logoGlow)"
            />
          ))}
        </g>
        
        {/* ========== SECOND RING - Counter Rotating ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-reverse 15s linear infinite' }}>
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="rgba(0, 230, 255, 0.3)"
            strokeWidth="1"
          />
          {/* Energy nodes */}
          {MID_NODES.map((node, i) => (
            <circle
              key={`mid-node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="2.5"
              fill="rgba(0, 255, 255, 0.9)"
              filter="url(#logoGlow)"
            />
          ))}
          {/* Energy arcs */}
          {midArcs.map((arc, i) => (
            <path
              key={`mid-arc-${i}`}
              d={arc.d}
              fill="none"
              stroke="rgba(0, 255, 255, 0.7)"
              strokeWidth="2"
              filter="url(#logoGlow)"
            />
          ))}
        </g>
        
        {/* ========== INNER RING - Fast Rotation ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-fast 10s linear infinite' }}>
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="1.5"
            filter="url(#logoGlow)"
          />
          {/* Small energy dots */}
          {INNER_DOTS.map((dot, i) => (
            <circle
              key={`inner-dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r="1.5"
              fill="rgba(0, 255, 255, 0.95)"
              filter="url(#logoGlow)"
            />
          ))}
        </g>
        
        {/* ========== CORE FRAME ========== */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="none"
          stroke="rgba(0, 255, 255, 0.6)"
          strokeWidth="2"
          filter="url(#logoGlow)"
          style={{ animation: 'logo-core-pulse 1.8s ease-in-out infinite' }}
        />
        
        {/* ========== CORE OUTER GLOW ========== */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="url(#logoGlowGrad)"
          style={{ animation: 'logo-core-glow 2s ease-in-out infinite' }}
        />
        
        {/* ========== MAIN CORE ========== */}
        <circle
          cx="50"
          cy="50"
          r="10"
          fill="url(#logoCoreGrad)"
          filter="url(#logoStrongGlow)"
          style={{ animation: 'logo-core-main-pulse 1.5s ease-in-out infinite' }}
        />
        
        {/* ========== CORE CENTER ========== */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill="#ffffff"
          filter="url(#logoStrongGlow)"
        />
        
        {/* ========== CORE HIGHLIGHT ========== */}
        <circle
          cx="47"
          cy="47"
          r="2"
          fill="rgba(255, 255, 255, 0.98)"
          style={{ filter: 'blur(0.5px)' }}
        />
        
        {/* ========== ORBITING ENERGY PARTICLES ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-fast 5s linear infinite' }}>
          <circle cx="50" cy="6" r="2.5" fill="#ffffff" filter="url(#logoStrongGlow)" />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-reverse 7s linear infinite' }}>
          <circle cx="94" cy="50" r="2" fill="#ffffff" filter="url(#logoStrongGlow)" />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-fast 9s linear infinite' }}>
          <circle cx="50" cy="94" r="2" fill="#ffffff" filter="url(#logoStrongGlow)" />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'logo-rotate-reverse 11s linear infinite' }}>
          <circle cx="6" cy="50" r="1.5" fill="#ffffff" filter="url(#logoStrongGlow)" />
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
      
      {/* Embedded CSS Animations */}
      <style jsx>{`
        @keyframes logo-plasma-pulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
        }
        
        @keyframes logo-energy-field {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(0.95); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.08); 
          }
        }
        
        @keyframes logo-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes logo-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes logo-rotate-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes logo-core-pulse {
          0%, 100% { 
            opacity: 0.6; 
            stroke-width: 2;
          }
          50% { 
            opacity: 1; 
            stroke-width: 3;
          }
        }
        
        @keyframes logo-core-glow {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.15); 
          }
        }
        
        @keyframes logo-core-main-pulse {
          0%, 100% { 
            opacity: 0.95; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.06); 
          }
        }
      `}</style>
    </div>
  );
}
