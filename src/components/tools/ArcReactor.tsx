'use client';

import React, { useMemo } from 'react';

// Pre-calculated positions for outer ring (12 nodes at radius 245)
const OUTER_NODES = [
  { cx: 520, cy: 275 }, { cx: 448, cy: 448 }, { cx: 275, cy: 520 }, { cx: 102, cy: 448 },
  { cx: 30, cy: 275 }, { cx: 102, cy: 102 }, { cx: 275, cy: 30 }, { cx: 448, cy: 102 },
  { cx: 491, cy: 152 }, { cx: 398, cy: 470 }, { cx: 152, cy: 470 }, { cx: 59, cy: 152 },
];

// Pre-calculated positions for mid ring (8 nodes at radius 200)
const MID_NODES = [
  { cx: 475, cy: 275 }, { cx: 416, cy: 416 }, { cx: 275, cy: 475 }, { cx: 134, cy: 416 },
  { cx: 75, cy: 275 }, { cx: 134, cy: 134 }, { cx: 275, cy: 75 }, { cx: 416, cy: 134 },
];

// Pre-calculated positions for inner ring (16 dots at radius 155)
const INNER_DOTS = [
  { cx: 430, cy: 275 }, { cx: 385, cy: 385 }, { cx: 275, cy: 430 }, { cx: 165, cy: 385 },
  { cx: 120, cy: 275 }, { cx: 165, cy: 165 }, { cx: 275, cy: 120 }, { cx: 385, cy: 165 },
  { cx: 407, cy: 323 }, { cx: 323, cy: 407 }, { cx: 227, cy: 407 }, { cx: 143, cy: 323 },
  { cx: 143, cy: 227 }, { cx: 227, cy: 143 }, { cx: 323, cy: 143 }, { cx: 407, cy: 227 },
];

// Pre-calculated positions for fourth ring (24 dots at radius 110)
const TINY_DOTS = [
  { cx: 385, cy: 275 }, { cx: 363, cy: 341 }, { cx: 309, cy: 385 }, { cx: 241, cy: 385 },
  { cx: 187, cy: 341 }, { cx: 165, cy: 275 }, { cx: 187, cy: 209 }, { cx: 241, cy: 165 },
  { cx: 309, cy: 165 }, { cx: 363, cy: 209 }, { cx: 377, cy: 297 }, { cx: 340, cy: 365 },
  { cx: 275, cy: 385 }, { cx: 210, cy: 365 }, { cx: 173, cy: 297 }, { cx: 173, cy: 253 },
  { cx: 210, cy: 185 }, { cx: 275, cy: 165 }, { cx: 340, cy: 185 }, { cx: 377, cy: 253 },
  { cx: 390, cy: 310 }, { cx: 320, cy: 378 }, { cx: 230, cy: 378 }, { cx: 160, cy: 310 },
];

// Pre-calculated orbit particle positions
const ORBIT_PARTICLES = [
  { cx: 505, cy: 275 }, { cx: 275, cy: 505 }, { cx: 45, cy: 275 },
  { cx: 438, cy: 112 }, { cx: 438, cy: 438 }, { cx: 112, cy: 438 },
  { cx: 112, cy: 112 }, { cx: 390, cy: 162 },
];

// Hexagon points pre-calculated
const HEX_POINTS = "275,220 322,247.5 322,302.5 275,330 228,302.5 228,247.5";

/**
 * JARVIS Arc Reactor - Advanced Tech Edition
 * A breathtaking, futuristic arc reactor with cinematic dynamic animations
 * Inspired by Stark Industries and JARVIS AI technology
 */
export default function ArcReactor() {
  // Memoize arc paths
  const outerArcs = useMemo(() => 
    [...Array(12)].map((_, i) => {
      const startAngle = (i * 30 - 8) * Math.PI / 180;
      const endAngle = (i * 30 + 8) * Math.PI / 180;
      const r = 245;
      const cx = Math.round(275 + r * Math.cos(startAngle));
      const cy = Math.round(275 + r * Math.sin(startAngle));
      const ex = Math.round(275 + r * Math.cos(endAngle));
      const ey = Math.round(275 + r * Math.sin(endAngle));
      return { d: `M ${cx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}` };
    }), []
  );
  
  const midArcs = useMemo(() =>
    [...Array(8)].map((_, i) => {
      const startAngle = (i * 45 + 12) * Math.PI / 180;
      const endAngle = (i * 45 + 33) * Math.PI / 180;
      const r = 200;
      const cx = Math.round(275 + r * Math.cos(startAngle));
      const cy = Math.round(275 + r * Math.sin(startAngle));
      const ex = Math.round(275 + r * Math.cos(endAngle));
      const ey = Math.round(275 + r * Math.sin(endAngle));
      return { d: `M ${cx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}` };
    }), []
  );
  
  const innerArcs = useMemo(() =>
    [...Array(8)].map((_, i) => {
      const startAngle = (i * 45 + 10) * Math.PI / 180;
      const endAngle = (i * 45 + 35) * Math.PI / 180;
      const r = 155;
      const cx = Math.round(275 + r * Math.cos(startAngle));
      const cy = Math.round(275 + r * Math.sin(startAngle));
      const ex = Math.round(275 + r * Math.cos(endAngle));
      const ey = Math.round(275 + r * Math.sin(endAngle));
      return { d: `M ${cx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}` };
    }), []
  );

  return (
    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center mx-auto">
      {/* Outer Plasma Field */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(0, 200, 255, 0.08) 35%, transparent 60%)',
          animation: 'jarvis-plasma 4.5s ease-in-out infinite',
          filter: 'blur(35px)'
        }}
      />
      
      {/* Secondary Energy Layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '72%',
          height: '72%',
          top: '14%',
          left: '14%',
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 65%)',
          animation: 'jarvis-energy 3s ease-in-out infinite'
        }}
      />
      
      {/* Inner Core Glow */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '35%',
          height: '35%',
          top: '32.5%',
          left: '32.5%',
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
          animation: 'jarvis-core-glow 2s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        viewBox="0 0 550 550" 
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 0 50px rgba(0, 240, 255, 0.6))' }}
      >
        <defs>
          {/* Core Gradients */}
          <radialGradient id="jarvisCore" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#f0ffff" />
            <stop offset="30%" stopColor="#00ffff" />
            <stop offset="45%" stopColor="#00e5ff" />
            <stop offset="60%" stopColor="#00bcd4" />
            <stop offset="80%" stopColor="#0097a7" />
            <stop offset="100%" stopColor="#00796b" />
          </radialGradient>
          
          <radialGradient id="jarvisGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="25%" stopColor="rgba(0, 255, 255, 0.75)" />
            <stop offset="50%" stopColor="rgba(0, 230, 255, 0.4)" />
            <stop offset="75%" stopColor="rgba(0, 200, 230, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Ring Gradients */}
          <linearGradient id="jarvisRing1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="33%" stopColor="#00e5ff" />
            <stop offset="66%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#0097a7" />
          </linearGradient>
          
          <linearGradient id="jarvisRing2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="jarvisGlowFilter" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="jarvisStrongGlow" x="-140%" y="-140%" width="380%" height="380%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="jarvisUltraGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Decorative Outer Ring */}
        <circle
          cx="275"
          cy="275"
          r="268"
          fill="none"
          stroke="rgba(0, 230, 255, 0.12)"
          strokeWidth="1"
          style={{ animation: 'jarvis-deco-pulse 4s ease-in-out infinite' }}
        />
        
        {/* ==================== OUTER RING - Energy Nodes ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-slow 25s linear infinite' }}>
          {/* Large Energy Nodes */}
          {OUTER_NODES.map((node, i) => (
            <React.Fragment key={`outer-node-${i}`}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="6"
                fill="none"
                stroke="url(#jarvisRing1)"
                strokeWidth="2"
                filter="url(#jarvisGlowFilter)"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="2"
                fill="rgba(0, 255, 255, 0.9)"
                filter="url(#jarvisGlowFilter)"
              />
            </React.Fragment>
          ))}
          {/* Connecting Arcs */}
          {outerArcs.map((arc, i) => (
            <path
              key={`outer-arc-${i}`}
              d={arc.d}
              fill="none"
              stroke="rgba(0, 240, 255, 0.5)"
              strokeWidth="1.5"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
        </g>
        
        {/* ==================== SECOND RING - Counter Rotating ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-reverse 20s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="200"
            fill="none"
            stroke="rgba(0, 230, 255, 0.2)"
            strokeWidth="1.5"
          />
          {/* Medium Energy Nodes */}
          {MID_NODES.map((node, i) => (
            <React.Fragment key={`mid-node-${i}`}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="8"
                fill="none"
                stroke="url(#jarvisRing2)"
                strokeWidth="2"
                filter="url(#jarvisGlowFilter)"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="3"
                fill="rgba(0, 255, 255, 0.85)"
                filter="url(#jarvisGlowFilter)"
              />
            </React.Fragment>
          ))}
          {/* Energy Arcs */}
          {midArcs.map((arc, i) => (
            <path
              key={`mid-arc-${i}`}
              d={arc.d}
              fill="none"
              stroke="rgba(0, 255, 255, 0.65)"
              strokeWidth="3"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
        </g>
        
        {/* ==================== THIRD RING - Energy Waves ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate 15s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="155"
            fill="none"
            stroke="rgba(0, 240, 255, 0.3)"
            strokeWidth="2"
            filter="url(#jarvisGlowFilter)"
          />
          {/* Small Energy Dots */}
          {INNER_DOTS.map((dot, i) => (
            <circle
              key={`inner-dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="rgba(0, 255, 255, 0.9)"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
          {/* Inner Energy Arcs */}
          {innerArcs.map((arc, i) => (
            <path
              key={`inner-arc-${i}`}
              d={arc.d}
              fill="none"
              stroke="rgba(0, 255, 255, 0.55)"
              strokeWidth="2"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
        </g>
        
        {/* ==================== FOURTH RING - Fast Counter ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-reverse 10s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="110"
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="2.5"
            filter="url(#jarvisGlowFilter)"
          />
          {/* Tiny Energy Dots */}
          {TINY_DOTS.map((dot, i) => (
            <circle
              key={`tiny-dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r="2"
              fill="rgba(0, 255, 255, 0.95)"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
        </g>
        
        {/* ==================== FIFTH RING - Pulse Ring ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate 7s linear infinite' }}>
          <circle
            cx="275"
            cy="275"
            r="75"
            fill="none"
            stroke="rgba(0, 255, 255, 0.5)"
            strokeWidth="3"
            filter="url(#jarvisGlowFilter)"
            style={{ animation: 'jarvis-pulse-ring 2s ease-in-out infinite' }}
          />
        </g>
        
        {/* ==================== HEXAGONAL CORE FRAME ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-reverse 5s linear infinite' }}>
          <polygon
            points={HEX_POINTS}
            fill="none"
            stroke="rgba(0, 255, 255, 0.6)"
            strokeWidth="3"
            filter="url(#jarvisGlowFilter)"
            style={{ animation: 'jarvis-hex-pulse 1.8s ease-in-out infinite' }}
          />
        </g>
        
        {/* ==================== CORE OUTER GLOW ==================== */}
        <circle
          cx="275"
          cy="275"
          r="45"
          fill="url(#jarvisGlow)"
          style={{ animation: 'jarvis-core-outer 2s ease-in-out infinite' }}
        />
        
        {/* ==================== MAIN CORE ==================== */}
        <circle
          cx="275"
          cy="275"
          r="35"
          fill="url(#jarvisCore)"
          filter="url(#jarvisUltraGlow)"
          style={{ animation: 'jarvis-core-main 1.5s ease-in-out infinite' }}
        />
        
        {/* Core Inner Ring */}
        <circle
          cx="275"
          cy="275"
          r="22"
          fill="none"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.5"
          style={{ animation: 'jarvis-inner-ring 1.2s ease-in-out infinite' }}
        />
        
        {/* Core Bright Center */}
        <circle
          cx="275"
          cy="275"
          r="14"
          fill="#ffffff"
          filter="url(#jarvisUltraGlow)"
        />
        
        {/* Core Highlight */}
        <circle
          cx="268"
          cy="268"
          r="5"
          fill="rgba(255, 255, 255, 0.98)"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* ==================== ORBITING PLASMA PARTICLES ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate 4s linear infinite' }}>
          <circle cx="275" cy="38" r="6" fill="#ffffff" filter="url(#jarvisStrongGlow)" />
          <path d="M 275 38 Q 275 80 230 120" fill="none" stroke="rgba(0, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-reverse 6s linear infinite' }}>
          <circle cx="512" cy="275" r="5" fill="#ffffff" filter="url(#jarvisStrongGlow)" />
        </g>
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate 8s linear infinite' }}>
          <circle cx="275" cy="512" r="5" fill="#ffffff" filter="url(#jarvisStrongGlow)" />
        </g>
        <g style={{ transformOrigin: '275px 275px', animation: 'jarvis-rotate-reverse 10s linear infinite' }}>
          <circle cx="38" cy="275" r="4" fill="#ffffff" filter="url(#jarvisStrongGlow)" />
        </g>
        
        {/* Additional Orbiting Particles */}
        {ORBIT_PARTICLES.map((particle, i) => (
          <g 
            key={`orbit-${i}`}
            style={{ 
              transformOrigin: '275px 275px', 
              animation: `jarvis-rotate ${6 + i * 1.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
            }}
          >
            <circle 
              cx={particle.cx}
              cy={particle.cy}
              r={2 + (i % 3) * 0.5} 
              fill={`rgba(0, ${250 - i * 5}, 255, ${0.7 + (i % 3) * 0.1})`}
              filter="url(#jarvisGlowFilter)"
            />
          </g>
        ))}
      </svg>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes jarvis-plasma {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        
        @keyframes jarvis-energy {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }
        
        @keyframes jarvis-core-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        
        @keyframes jarvis-deco-pulse {
          0%, 100% { opacity: 0.12; stroke-width: 1; }
          50% { opacity: 0.25; stroke-width: 1.5; }
        }
        
        @keyframes jarvis-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes jarvis-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes jarvis-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes jarvis-pulse-ring {
          0%, 100% { opacity: 0.5; stroke-width: 3; }
          50% { opacity: 1; stroke-width: 4.5; }
        }
        
        @keyframes jarvis-hex-pulse {
          0%, 100% { opacity: 0.6; stroke-width: 3; }
          50% { opacity: 1; stroke-width: 4; }
        }
        
        @keyframes jarvis-core-outer {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        
        @keyframes jarvis-core-main {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes jarvis-inner-ring {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
