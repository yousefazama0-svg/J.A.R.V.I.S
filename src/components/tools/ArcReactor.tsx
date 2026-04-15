'use client';

import React from 'react';

/**
 * JARVIS Arc Reactor - Advanced Tech Edition
 * A breathtaking, futuristic arc reactor with cinematic dynamic animations
 * Inspired by Stark Industries and JARVIS AI technology
 * Features: Rotating rings, energy arcs, plasma waves, hexagonal core
 */
export default function ArcReactor() {
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
          {/* 12 Large Energy Nodes */}
          {[...Array(12)].map((_, i) => (
            <React.Fragment key={`outer-node-${i}`}>
              <circle
                cx={275 + 245 * Math.cos((i * 30) * Math.PI / 180)}
                cy={275 + 245 * Math.sin((i * 30) * Math.PI / 180)}
                r="6"
                fill="none"
                stroke="url(#jarvisRing1)"
                strokeWidth="2"
                filter="url(#jarvisGlowFilter)"
              />
              <circle
                cx={275 + 245 * Math.cos((i * 30) * Math.PI / 180)}
                cy={275 + 245 * Math.sin((i * 30) * Math.PI / 180)}
                r="2"
                fill="rgba(0, 255, 255, 0.9)"
                filter="url(#jarvisGlowFilter)"
              />
            </React.Fragment>
          ))}
          {/* Connecting Arcs */}
          {[...Array(12)].map((_, i) => (
            <path
              key={`outer-arc-${i}`}
              d={`M ${275 + 245 * Math.cos((i * 30 - 8) * Math.PI / 180)} ${275 + 245 * Math.sin((i * 30 - 8) * Math.PI / 180)} A 245 245 0 0 1 ${275 + 245 * Math.cos((i * 30 + 8) * Math.PI / 180)} ${275 + 245 * Math.sin((i * 30 + 8) * Math.PI / 180)}`}
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
          {/* 8 Medium Energy Nodes */}
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={`mid-node-${i}`}>
              <circle
                cx={275 + 200 * Math.cos((i * 45) * Math.PI / 180)}
                cy={275 + 200 * Math.sin((i * 45) * Math.PI / 180)}
                r="8"
                fill="none"
                stroke="url(#jarvisRing2)"
                strokeWidth="2"
                filter="url(#jarvisGlowFilter)"
              />
              <circle
                cx={275 + 200 * Math.cos((i * 45) * Math.PI / 180)}
                cy={275 + 200 * Math.sin((i * 45) * Math.PI / 180)}
                r="3"
                fill="rgba(0, 255, 255, 0.85)"
                filter="url(#jarvisGlowFilter)"
              />
            </React.Fragment>
          ))}
          {/* Energy Arcs */}
          {[...Array(8)].map((_, i) => (
            <path
              key={`mid-arc-${i}`}
              d={`M ${275 + 200 * Math.cos((i * 45 + 12) * Math.PI / 180)} ${275 + 200 * Math.sin((i * 45 + 12) * Math.PI / 180)} A 200 200 0 0 1 ${275 + 200 * Math.cos((i * 45 + 33) * Math.PI / 180)} ${275 + 200 * Math.sin((i * 45 + 33) * Math.PI / 180)}`}
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
          {/* 16 Small Energy Dots */}
          {[...Array(16)].map((_, i) => (
            <circle
              key={`inner-dot-${i}`}
              cx={275 + 155 * Math.cos((i * 22.5) * Math.PI / 180)}
              cy={275 + 155 * Math.sin((i * 22.5) * Math.PI / 180)}
              r="3"
              fill="rgba(0, 255, 255, 0.9)"
              filter="url(#jarvisGlowFilter)"
            />
          ))}
          {/* Inner Energy Arcs */}
          {[...Array(8)].map((_, i) => (
            <path
              key={`inner-arc-${i}`}
              d={`M ${275 + 155 * Math.cos((i * 45 + 10) * Math.PI / 180)} ${275 + 155 * Math.sin((i * 45 + 10) * Math.PI / 180)} A 155 155 0 0 1 ${275 + 155 * Math.cos((i * 45 + 35) * Math.PI / 180)} ${275 + 155 * Math.sin((i * 45 + 35) * Math.PI / 180)}`}
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
          {/* 24 Tiny Energy Dots */}
          {[...Array(24)].map((_, i) => (
            <circle
              key={`tiny-dot-${i}`}
              cx={275 + 110 * Math.cos((i * 15) * Math.PI / 180)}
              cy={275 + 110 * Math.sin((i * 15) * Math.PI / 180)}
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
          {/* Hexagon shape */}
          <polygon
            points={Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 60 - 90) * Math.PI / 180;
              return `${275 + 55 * Math.cos(angle)},${275 + 55 * Math.sin(angle)}`;
            }).join(' ')}
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
        {[...Array(8)].map((_, i) => (
          <g 
            key={`orbit-${i}`}
            style={{ 
              transformOrigin: '275px 275px', 
              animation: `jarvis-rotate ${6 + i * 1.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
            }}
          >
            <circle 
              cx={275 + 230 * Math.cos(i * 45 * Math.PI / 180)} 
              cy={275 + 230 * Math.sin(i * 45 * Math.PI / 180)} 
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
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.08); 
          }
        }
        
        @keyframes jarvis-energy {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.9; 
            transform: scale(1.15); 
          }
        }
        
        @keyframes jarvis-core-glow {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.25); 
          }
        }
        
        @keyframes jarvis-deco-pulse {
          0%, 100% { 
            opacity: 0.12; 
            stroke-width: 1;
          }
          50% { 
            opacity: 0.25; 
            stroke-width: 1.5;
          }
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
          0%, 100% { 
            opacity: 0.5; 
            stroke-width: 3;
          }
          50% { 
            opacity: 1; 
            stroke-width: 4.5;
          }
        }
        
        @keyframes jarvis-hex-pulse {
          0%, 100% { 
            opacity: 0.6; 
            stroke-width: 3;
          }
          50% { 
            opacity: 1; 
            stroke-width: 4;
          }
        }
        
        @keyframes jarvis-core-outer {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.12); 
          }
        }
        
        @keyframes jarvis-core-main {
          0%, 100% { 
            opacity: 0.95; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes jarvis-inner-ring {
          0%, 100% { 
            opacity: 0.35; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.65; 
            transform: scale(1.1); 
          }
        }
      `}</style>
    </div>
  );
}
