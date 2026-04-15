'use client';

import React from 'react';

/**
 * Iron Man Arc Reactor - Full Size Component
 * A stunning, movie-accurate arc reactor with ultra-smooth animations
 * Inspired by Tony Stark's arc reactor from the Marvel Cinematic Universe
 * Features multiple rotating rings, energy particles, and glowing core
 */
export default function ArcReactor() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center mx-auto">
      {/* Outer Energy Field */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 180, 255, 0.15) 0%, rgba(0, 150, 255, 0.08) 30%, transparent 60%)',
          animation: 'iron-man-outer-glow 4s ease-in-out infinite',
          filter: 'blur(20px)'
        }}
      />
      
      {/* Secondary Glow Layer */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '70%',
          height: '70%',
          top: '15%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.2) 0%, transparent 70%)',
          animation: 'iron-man-inner-glow 3s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0, 200, 255, 0.4))' }}
      >
        <defs>
          {/* Core Gradients */}
          <radialGradient id="ironManCoreGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#e0f8ff" />
            <stop offset="30%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00bcd4" />
            <stop offset="70%" stopColor="#0097a7" />
            <stop offset="100%" stopColor="#006064" />
          </radialGradient>
          
          <radialGradient id="ironManCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="30%" stopColor="rgba(0, 229, 255, 0.6)" />
            <stop offset="60%" stopColor="rgba(0, 188, 212, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Ring Gradients */}
          <linearGradient id="ironManRingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00bcd4" />
            <stop offset="100%" stopColor="#0097a7" />
          </linearGradient>
          
          <linearGradient id="ironManRingGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00bcd4" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0097a7" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="ironManGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="ironManStrongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="ironManUltraGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outermost Decorative Ring */}
        <circle
          cx="250"
          cy="250"
          r="245"
          fill="none"
          stroke="rgba(0, 150, 255, 0.1)"
          strokeWidth="1"
        />
        
        {/* ==================== OUTER RING - Slowest Rotation ==================== */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate-slow 30s linear infinite' }}>
          {/* 10 Large Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`outer-tri-${i}`}
              d={`M 250 15 L 258 40 L 242 40 Z`}
              fill="rgba(0, 200, 255, 0.6)"
              transform={`rotate(${i * 36}, 250, 250)`}
              style={{ filter: 'drop-shadow(0 0 6px rgba(0, 200, 255, 0.5))' }}
            />
          ))}
          
          {/* Decorative Arc Segments */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`outer-arc-${i}`}
              d={`M ${250 + 210 * Math.cos((i * 18 - 6) * Math.PI / 180)} ${250 + 210 * Math.sin((i * 18 - 6) * Math.PI / 180)} A 210 210 0 0 1 ${250 + 210 * Math.cos((i * 18 + 6) * Math.PI / 180)} ${250 + 210 * Math.sin((i * 18 + 6) * Math.PI / 180)}`}
              fill="none"
              stroke="rgba(0, 220, 255, 0.4)"
              strokeWidth="2"
              filter="url(#ironManGlow)"
            />
          ))}
        </g>
        
        {/* ==================== SECOND RING - Counter Rotation ==================== */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate-reverse 25s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="250"
            cy="250"
            r="180"
            fill="none"
            stroke="rgba(0, 180, 255, 0.3)"
            strokeWidth="2"
          />
          
          {/* 10 Medium Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-tri-${i}`}
              d={`M 250 70 L 256 90 L 244 90 Z`}
              fill="rgba(0, 220, 255, 0.75)"
              transform={`rotate(${i * 36 + 18}, 250, 250)`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 220, 255, 0.6))' }}
            />
          ))}
          
          {/* Energy Arcs */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-arc-${i}`}
              d={`M ${250 + 170 * Math.cos((i * 36 + 5) * Math.PI / 180)} ${250 + 170 * Math.sin((i * 36 + 5) * Math.PI / 180)} A 170 170 0 0 1 ${250 + 170 * Math.cos((i * 36 + 31) * Math.PI / 180)} ${250 + 170 * Math.sin((i * 36 + 31) * Math.PI / 180)}`}
              fill="none"
              stroke="rgba(0, 230, 255, 0.6)"
              strokeWidth="3"
              filter="url(#ironManGlow)"
            />
          ))}
        </g>
        
        {/* ==================== THIRD RING - Medium Rotation ==================== */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate 18s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="250"
            cy="250"
            r="140"
            fill="none"
            stroke="rgba(0, 180, 255, 0.4)"
            strokeWidth="2.5"
            filter="url(#ironManGlow)"
          />
          
          {/* 10 Inner Triangular Segments */}
          {[...Array(10)].map((_, i) => (
            <path
              key={`inner-tri-${i}`}
              d={`M 250 110 L 255 125 L 245 125 Z`}
              fill="rgba(0, 230, 255, 0.85)"
              transform={`rotate(${i * 36}, 250, 250)`}
              style={{ filter: 'drop-shadow(0 0 6px rgba(0, 230, 255, 0.7))' }}
            />
          ))}
        </g>
        
        {/* ==================== FOURTH RING - Fast Counter Rotation ==================== */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate-reverse 12s linear infinite' }}>
          {/* Ring Circle */}
          <circle
            cx="250"
            cy="250"
            r="100"
            fill="none"
            stroke="rgba(0, 200, 255, 0.5)"
            strokeWidth="3"
            filter="url(#ironManGlow)"
          />
          
          {/* Small Energy Segments */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`seg-${i}`}
              d={`M 250 150 L 252 158 L 248 158 Z`}
              fill="rgba(0, 240, 255, 0.9)"
              transform={`rotate(${i * 18}, 250, 250)`}
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.8))' }}
            />
          ))}
        </g>
        
        {/* ==================== INNER FRAME RING ==================== */}
        <circle
          cx="250"
          cy="250"
          r="70"
          fill="none"
          stroke="rgba(0, 200, 255, 0.6)"
          strokeWidth="4"
          style={{ 
            filter: 'drop-shadow(0 0 10px rgba(0, 200, 255, 0.7))',
            animation: 'iron-man-pulse-ring 2.5s ease-in-out infinite'
          }}
        />
        
        {/* ==================== CORE OUTER GLOW ==================== */}
        <circle
          cx="250"
          cy="250"
          r="55"
          fill="url(#ironManCoreGlow)"
          style={{ animation: 'iron-man-core-outer-pulse 2s ease-in-out infinite' }}
        />
        
        {/* ==================== MAIN CORE ==================== */}
        <circle
          cx="250"
          cy="250"
          r="45"
          fill="url(#ironManCoreGradient)"
          filter="url(#ironManUltraGlow)"
          style={{ animation: 'iron-man-core-pulse 1.5s ease-in-out infinite' }}
        />
        
        {/* Core Inner Bright Ring */}
        <circle
          cx="250"
          cy="250"
          r="28"
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          style={{ animation: 'iron-man-inner-ring-pulse 1.2s ease-in-out infinite' }}
        />
        
        {/* Core Bright Center */}
        <circle
          cx="250"
          cy="250"
          r="18"
          fill="#ffffff"
          filter="url(#ironManUltraGlow)"
        />
        
        {/* Core Highlight */}
        <circle
          cx="242"
          cy="242"
          r="8"
          fill="rgba(255, 255, 255, 0.95)"
          style={{ filter: 'blur(2px)' }}
        />
        
        {/* ==================== ORBITING PARTICLES ==================== */}
        {/* Particle 1 - Fast */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate 5s linear infinite' }}>
          <circle 
            cx="250" 
            cy="35" 
            r="4" 
            fill="#ffffff" 
            filter="url(#ironManStrongGlow)"
          />
          {/* Energy Trail */}
          <path
            d="M 250 35 Q 250 50 235 65"
            fill="none"
            stroke="rgba(0, 220, 255, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        
        {/* Particle 2 - Medium Counter */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate-reverse 7s linear infinite' }}>
          <circle 
            cx="465" 
            cy="250" 
            r="3" 
            fill="#ffffff" 
            filter="url(#ironManStrongGlow)"
          />
        </g>
        
        {/* Particle 3 - Slow */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate 9s linear infinite' }}>
          <circle 
            cx="250" 
            cy="465" 
            r="3" 
            fill="#ffffff" 
            filter="url(#ironManStrongGlow)"
          />
        </g>
        
        {/* Particle 4 - Counter Medium */}
        <g style={{ transformOrigin: '250px 250px', animation: 'iron-man-rotate-reverse 11s linear infinite' }}>
          <circle 
            cx="35" 
            cy="250" 
            r="2.5" 
            fill="#ffffff" 
            filter="url(#ironManStrongGlow)"
          />
        </g>
        
        {/* Additional Energy Particles */}
        {[...Array(8)].map((_, i) => (
          <g 
            key={`particle-${i}`}
            style={{ 
              transformOrigin: '250px 250px', 
              animation: `iron-man-rotate ${8 + i * 2}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
            }}
          >
            <circle 
              cx={250 + 200 * Math.cos(i * 45 * Math.PI / 180)} 
              cy={250 + 200 * Math.sin(i * 45 * Math.PI / 180)} 
              r={1.5} 
              fill="rgba(0, 230, 255, 0.8)" 
              filter="url(#ironManGlow)"
            />
          </g>
        ))}
      </svg>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes iron-man-outer-glow {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes iron-man-inner-glow {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        @keyframes iron-man-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes iron-man-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes iron-man-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes iron-man-pulse-ring {
          0%, 100% { 
            opacity: 0.6;
            stroke-width: 4;
            stroke: 'rgba(0, 200, 255, 0.6)';
          }
          50% { 
            opacity: 1;
            stroke-width: 5;
            stroke: 'rgba(0, 220, 255, 0.8)';
          }
        }
        
        @keyframes iron-man-core-outer-pulse {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.08);
          }
        }
        
        @keyframes iron-man-core-pulse {
          0%, 100% { 
            opacity: 0.95;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.03);
          }
        }
        
        @keyframes iron-man-inner-ring-pulse {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
