'use client';

import React from 'react';

interface ArcReactorLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * Iron Man Arc Reactor Logo - Ultimate Edition
 * A breathtaking, movie-accurate arc reactor with ultra-smooth dynamic animations
 * Features rotating rings, energy particles, and pulsating core
 */
export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer Energy Field */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 16,
          height: size + 16,
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.3) 0%, rgba(0, 150, 255, 0.15) 40%, transparent 70%)',
          animation: 'arc-logo-glow 2.5s ease-in-out infinite',
          filter: 'blur(3px)'
        }}
      />
      
      {/* Secondary Glow */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 8,
          height: size + 8,
          background: 'radial-gradient(circle, rgba(0, 230, 255, 0.2) 0%, transparent 60%)',
          animation: 'arc-logo-pulse 2s ease-in-out infinite 0.5s'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0, 220, 255, 0.6))' }}
      >
        <defs>
          {/* Core Gradients */}
          <radialGradient id="arcLogoCore" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e0faff" />
            <stop offset="40%" stopColor="#00f0ff" />
            <stop offset="60%" stopColor="#00d4e8" />
            <stop offset="80%" stopColor="#00a8c6" />
            <stop offset="100%" stopColor="#007a9e" />
          </radialGradient>
          
          <radialGradient id="arcLogoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="30%" stopColor="rgba(0, 240, 255, 0.6)" />
            <stop offset="60%" stopColor="rgba(0, 200, 230, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Segment Gradient */}
          <linearGradient id="arcLogoSegment" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#00d4e8" />
            <stop offset="100%" stopColor="#00b8d4" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="arcLogoFilter" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="arcLogoStrongFilter" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Decorative Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(0, 200, 255, 0.15)"
          strokeWidth="0.5"
          style={{ animation: 'arc-logo-ring-pulse 3s ease-in-out infinite' }}
        />
        
        {/* ========== OUTER RING - 10 Triangular Segments ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate-slow 18s linear infinite' }}>
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={`outer-${i}`}>
              <path
                d="M 50 4 L 53 12 L 47 12 Z"
                fill="url(#arcLogoSegment)"
                transform={`rotate(${i * 36}, 50, 50)`}
                filter="url(#arcLogoFilter)"
                style={{ opacity: 0.85 }}
              />
            </React.Fragment>
          ))}
        </g>
        
        {/* ========== MIDDLE RING - Counter Rotating ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate-reverse 14s linear infinite' }}>
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(0, 200, 255, 0.25)"
            strokeWidth="1"
          />
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-${i}`}
              d="M 50 12 L 52 18 L 48 18 Z"
              fill="rgba(0, 240, 255, 0.9)"
              transform={`rotate(${i * 36 + 18}, 50, 50)`}
              filter="url(#arcLogoFilter)"
            />
          ))}
        </g>
        
        {/* ========== INNER RING - Fast Rotation ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate 10s linear infinite' }}>
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="rgba(0, 220, 255, 0.4)"
            strokeWidth="1.5"
            filter="url(#arcLogoFilter)"
          />
          {[...Array(10)].map((_, i) => (
            <path
              key={`inner-${i}`}
              d="M 50 22 L 51.5 27 L 48.5 27 Z"
              fill="rgba(0, 250, 255, 0.95)"
              transform={`rotate(${i * 36}, 50, 50)`}
              filter="url(#arcLogoFilter)"
            />
          ))}
        </g>
        
        {/* ========== CORE FRAME RING ========== */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="none"
          stroke="rgba(0, 230, 255, 0.6)"
          strokeWidth="2"
          filter="url(#arcLogoFilter)"
          style={{ animation: 'arc-logo-core-ring 2s ease-in-out infinite' }}
        />
        
        {/* ========== CORE OUTER GLOW ========== */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="url(#arcLogoGlow)"
          style={{ animation: 'arc-logo-core-glow 2s ease-in-out infinite' }}
        />
        
        {/* ========== MAIN CORE ========== */}
        <circle
          cx="50"
          cy="50"
          r="10"
          fill="url(#arcLogoCore)"
          filter="url(#arcLogoStrongFilter)"
          style={{ animation: 'arc-logo-core-pulse 1.5s ease-in-out infinite' }}
        />
        
        {/* ========== CORE CENTER ========== */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill="#ffffff"
          filter="url(#arcLogoStrongFilter)"
        />
        
        {/* ========== CORE HIGHLIGHT ========== */}
        <circle
          cx="47"
          cy="47"
          r="2.5"
          fill="rgba(255, 255, 255, 0.95)"
          style={{ filter: 'blur(0.5px)' }}
        />
        
        {/* ========== ORBITING ENERGY PARTICLES ========== */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate 5s linear infinite' }}>
          <circle 
            cx="50" 
            cy="5" 
            r="2" 
            fill="#ffffff" 
            filter="url(#arcLogoStrongFilter)"
          />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate-reverse 7s linear infinite' }}>
          <circle 
            cx="95" 
            cy="50" 
            r="1.5" 
            fill="#ffffff" 
            filter="url(#arcLogoStrongFilter)"
          />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate 9s linear infinite' }}>
          <circle 
            cx="50" 
            cy="95" 
            r="1.5" 
            fill="#ffffff" 
            filter="url(#arcLogoStrongFilter)"
          />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-logo-rotate-reverse 11s linear infinite' }}>
          <circle 
            cx="5" 
            cy="50" 
            r="1.5" 
            fill="#ffffff" 
            filter="url(#arcLogoStrongFilter)"
          />
        </g>
      </svg>
      
      {/* Text label if needed */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00d4e8' }}>
            JARVIS
          </span>
        </div>
      )}
      
      {/* Embedded CSS Animations */}
      <style jsx>{`
        @keyframes arc-logo-glow {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.08); 
          }
        }
        
        @keyframes arc-logo-pulse {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(0.95); 
          }
          50% { 
            opacity: 0.9; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes arc-logo-ring-pulse {
          0%, 100% { 
            opacity: 0.15; 
            stroke-width: 0.5;
          }
          50% { 
            opacity: 0.3; 
            stroke-width: 0.8;
          }
        }
        
        @keyframes arc-logo-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-logo-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes arc-logo-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-logo-core-ring {
          0%, 100% { 
            opacity: 0.6; 
            stroke-width: 2;
            stroke: 'rgba(0, 230, 255, 0.6)';
          }
          50% { 
            opacity: 1; 
            stroke-width: 2.5;
            stroke: 'rgba(0, 250, 255, 0.8)';
          }
        }
        
        @keyframes arc-logo-core-glow {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.15); 
          }
        }
        
        @keyframes arc-logo-core-pulse {
          0%, 100% { 
            opacity: 0.95; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05); 
          }
        }
      `}</style>
    </div>
  );
}
