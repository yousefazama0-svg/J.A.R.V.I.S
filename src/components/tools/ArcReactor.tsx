'use client';

import React from 'react';

/**
 * Iron Man Arc Reactor - Ultimate Full Size Edition
 * A stunning, hyper-detailed arc reactor with cinematic dynamic animations
 * Inspired by Tony Stark's arc reactor from Marvel Cinematic Universe
 * Features: Multiple rotating rings, energy arcs, plasma particles, pulsating core
 */
export default function ArcReactor() {
  return (
    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center mx-auto">
      {/* Outer Plasma Field */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 220, 255, 0.12) 0%, rgba(0, 180, 255, 0.06) 35%, transparent 60%)',
          animation: 'ironman-outer-plasma 5s ease-in-out infinite',
          filter: 'blur(30px)'
        }}
      />
      
      {/* Secondary Energy Layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '75%',
          height: '75%',
          top: '12.5%',
          left: '12.5%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.18) 0%, transparent 65%)',
          animation: 'ironman-energy-layer 3.5s ease-in-out infinite'
        }}
      />
      
      {/* Inner Core Glow */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '40%',
          height: '40%',
          top: '30%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.25) 0%, transparent 70%)',
          animation: 'ironman-core-glow-layer 2s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        viewBox="0 0 550 550" 
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 0 40px rgba(0, 220, 255, 0.5))' }}
      >
        <defs>
          {/* Core Gradients */}
          <radialGradient id="ironmanCoreUltimate" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#f0ffff" />
            <stop offset="25%" stopColor="#00f5ff" />
            <stop offset="40%" stopColor="#00e0ec" />
            <stop offset="55%" stopColor="#00c8d4" />
            <stop offset="70%" stopColor="#00a8b8" />
            <stop offset="85%" stopColor="#0088a0" />
            <stop offset="100%" stopColor="#006078" />
          </radialGradient>
          
          <radialGradient id="ironmanCoreGlowUltimate" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="25%" stopColor="rgba(0, 245, 255, 0.7)" />
            <stop offset="50%" stopColor="rgba(0, 210, 230, 0.4)" />
            <stop offset="75%" stopColor="rgba(0, 170, 200, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Ring Gradients */}
          <linearGradient id="ironmanRing1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="33%" stopColor="#00d4e8" />
            <stop offset="66%" stopColor="#00b8d4" />
            <stop offset="100%" stopColor="#0098b8" />
          </linearGradient>
          
          <linearGradient id="ironmanRing2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00e8f0" />
            <stop offset="50%" stopColor="#00c8d8" />
            <stop offset="100%" stopColor="#00a8c0" />
          </linearGradient>
          
          {/* Segment Gradient */}
          <linearGradient id="ironmanSegment" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#00e8f0" />
            <stop offset="100%" stopColor="#00d8e8" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="ironmanGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="ironmanStrongGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="ironmanUltraGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outermost Decorative Ring */}
        <circle
          cx="275"
          cy="275"
          r="270"
          fill="none"
          stroke="rgba(0, 200, 255, 0.1)"
          strokeWidth="1"
          style={{ animation: 'ironman-deco-ring 4s ease-in-out infinite' }}
        />
        
        {/* ==================== OUTER RING - Slowest Rotation ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate-slow 28s linear infinite' }}>
          {/* 10 Large Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={`outer-seg-${i}`}>
              <path
                d="M 275 18 L 283 45 L 267 45 Z"
                fill="url(#ironmanSegment)"
                transform={`rotate(${i * 36}, 275, 275)`}
                filter="url(#ironmanGlow)"
                style={{ opacity: 0.8 }}
              />
            </React.Fragment>
          ))}
          
          {/* Outer Arc Decorations */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`outer-arc-${i}`}
              d={`M ${275 + 235 * Math.cos((i * 18 - 5) * Math.PI / 180)} ${275 + 235 * Math.sin((i * 18 - 5) * Math.PI / 180)} A 235 235 0 0 1 ${275 + 235 * Math.cos((i * 18 + 5) * Math.PI / 180)} ${275 + 235 * Math.sin((i * 18 + 5) * Math.PI / 180)}`}
              fill="none"
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth="2"
              filter="url(#ironmanGlow)"
            />
          ))}
        </g>
        
        {/* ==================== SECOND RING - Counter Rotation ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate-reverse 22s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="200"
            fill="none"
            stroke="rgba(0, 200, 255, 0.25)"
            strokeWidth="1.5"
          />
          
          {/* 10 Medium Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-seg-${i}`}
              d="M 275 75 L 282 95 L 268 95 Z"
              fill="rgba(0, 245, 255, 0.85)"
              transform={`rotate(${i * 36 + 18}, 275, 275)`}
              filter="url(#ironmanGlow)"
            />
          ))}
          
          {/* Energy Arcs */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-arc-${i}`}
              d={`M ${275 + 190 * Math.cos((i * 36 + 8) * Math.PI / 180)} ${275 + 190 * Math.sin((i * 36 + 8) * Math.PI / 180)} A 190 190 0 0 1 ${275 + 190 * Math.cos((i * 36 + 28) * Math.PI / 180)} ${275 + 190 * Math.sin((i * 36 + 28) * Math.PI / 180)}`}
              fill="none"
              stroke="rgba(0, 250, 255, 0.55)"
              strokeWidth="2.5"
              filter="url(#ironmanGlow)"
            />
          ))}
        </g>
        
        {/* ==================== THIRD RING - Medium Rotation ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate 16s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="155"
            fill="none"
            stroke="rgba(0, 210, 255, 0.35)"
            strokeWidth="2"
            filter="url(#ironmanGlow)"
          />
          
          {/* 10 Inner Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`inner-seg-${i}`}
              d="M 275 120 L 280 135 L 270 135 Z"
              fill="rgba(0, 255, 255, 0.9)"
              transform={`rotate(${i * 36}, 275, 275)`}
              filter="url(#ironmanGlow)"
            />
          ))}
          
          {/* Small Energy Dots */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={`dot-${i}`}
              cx={275 + 148 * Math.cos((i * 18) * Math.PI / 180)}
              cy={275 + 148 * Math.sin((i * 18) * Math.PI / 180)}
              r="2"
              fill="rgba(0, 250, 255, 0.7)"
              filter="url(#ironmanGlow)"
            />
          ))}
        </g>
        
        {/* ==================== FOURTH RING - Fast Counter Rotation ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate-reverse 11s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="275"
            cy="275"
            r="110"
            fill="none"
            stroke="rgba(0, 230, 255, 0.45)"
            strokeWidth="2.5"
            filter="url(#ironmanGlow)"
          />
          
          {/* 20 Small Energy Segments */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`seg-${i}`}
              d="M 275 165 L 277 173 L 273 173 Z"
              fill="rgba(0, 255, 255, 0.95)"
              transform={`rotate(${i * 18}, 275, 275)`}
              filter="url(#ironmanGlow)"
            />
          ))}
        </g>
        
        {/* ==================== FIFTH RING - Pulse Ring ==================== */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate 7s linear infinite' }}>
          <circle
            cx="275"
            cy="275"
            r="78"
            fill="none"
            stroke="rgba(0, 240, 255, 0.55)"
            strokeWidth="3"
            filter="url(#ironmanGlow)"
            style={{ animation: 'ironman-pulse-ring 2s ease-in-out infinite' }}
          />
        </g>
        
        {/* ==================== INNER FRAME RING ==================== */}
        <circle
          cx="275"
          cy="275"
          r="58"
          fill="none"
          stroke="rgba(0, 245, 255, 0.65)"
          strokeWidth="3.5"
          filter="url(#ironmanGlow)"
          style={{ animation: 'ironman-inner-frame-pulse 1.8s ease-in-out infinite' }}
        />
        
        {/* ==================== CORE OUTER GLOW ==================== */}
        <circle
          cx="275"
          cy="275"
          r="48"
          fill="url(#ironmanCoreGlowUltimate)"
          style={{ animation: 'ironman-core-outer-pulse 2s ease-in-out infinite' }}
        />
        
        {/* ==================== MAIN CORE ==================== */}
        <circle
          cx="275"
          cy="275"
          r="38"
          fill="url(#ironmanCoreUltimate)"
          filter="url(#ironmanUltraGlow)"
          style={{ animation: 'ironman-core-main-pulse 1.5s ease-in-out infinite' }}
        />
        
        {/* Core Inner Ring */}
        <circle
          cx="275"
          cy="275"
          r="24"
          fill="none"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.5"
          style={{ animation: 'ironman-core-inner-ring 1.2s ease-in-out infinite' }}
        />
        
        {/* Core Bright Center */}
        <circle
          cx="275"
          cy="275"
          r="16"
          fill="#ffffff"
          filter="url(#ironmanUltraGlow)"
        />
        
        {/* Core Highlight */}
        <circle
          cx="268"
          cy="268"
          r="6"
          fill="rgba(255, 255, 255, 0.98)"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* ==================== ORBITING PLASMA PARTICLES ==================== */}
        {/* Main Particle 1 */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate 4s linear infinite' }}>
          <circle 
            cx="275" 
            cy="38" 
            r="5" 
            fill="#ffffff" 
            filter="url(#ironmanStrongGlow)"
          />
          <path
            d="M 275 38 Q 275 70 240 100"
            fill="none"
            stroke="rgba(0, 240, 255, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        
        {/* Main Particle 2 */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate-reverse 6s linear infinite' }}>
          <circle 
            cx="512" 
            cy="275" 
            r="4" 
            fill="#ffffff" 
            filter="url(#ironmanStrongGlow)"
          />
        </g>
        
        {/* Main Particle 3 */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate 8s linear infinite' }}>
          <circle 
            cx="275" 
            cy="512" 
            r="4" 
            fill="#ffffff" 
            filter="url(#ironmanStrongGlow)"
          />
        </g>
        
        {/* Main Particle 4 */}
        <g style={{ transformOrigin: '275px 275px', animation: 'ironman-rotate-reverse 10s linear infinite' }}>
          <circle 
            cx="38" 
            cy="275" 
            r="3.5" 
            fill="#ffffff" 
            filter="url(#ironmanStrongGlow)"
          />
        </g>
        
        {/* Additional Energy Particles */}
        {[...Array(12)].map((_, i) => (
          <g 
            key={`particle-${i}`}
            style={{ 
              transformOrigin: '275px 275px', 
              animation: `ironman-rotate ${7 + i * 1.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
            }}
          >
            <circle 
              cx={275 + 220 * Math.cos(i * 30 * Math.PI / 180)} 
              cy={275 + 220 * Math.sin(i * 30 * Math.PI / 180)} 
              r={1.5 + (i % 3) * 0.5} 
              fill={`rgba(0, ${240 + i * 2}, 255, ${0.6 + (i % 4) * 0.1})`}
              filter="url(#ironmanGlow)"
            />
          </g>
        ))}
      </svg>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ironman-outer-plasma {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.06); 
          }
        }
        
        @keyframes ironman-energy-layer {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.12); 
          }
        }
        
        @keyframes ironman-core-glow-layer {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }
        
        @keyframes ironman-deco-ring {
          0%, 100% { 
            opacity: 0.1; 
            stroke-width: 1;
          }
          50% { 
            opacity: 0.25; 
            stroke-width: 1.5;
          }
        }
        
        @keyframes ironman-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ironman-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes ironman-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ironman-pulse-ring {
          0%, 100% { 
            opacity: 0.55; 
            stroke-width: 3;
            r: 78;
          }
          50% { 
            opacity: 1; 
            stroke-width: 4;
            r: 80;
          }
        }
        
        @keyframes ironman-inner-frame-pulse {
          0%, 100% { 
            opacity: 0.65; 
            stroke-width: 3.5;
          }
          50% { 
            opacity: 1; 
            stroke-width: 4.5;
          }
        }
        
        @keyframes ironman-core-outer-pulse {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
        }
        
        @keyframes ironman-core-main-pulse {
          0%, 100% { 
            opacity: 0.95; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.04); 
          }
        }
        
        @keyframes ironman-core-inner-ring {
          0%, 100% { 
            opacity: 0.35; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.08); 
          }
        }
      `}</style>
    </div>
  );
}
