'use client';

import React from 'react';

interface ArcReactorLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * Iron Man Arc Reactor Logo Component
 * A highly detailed, movie-accurate arc reactor with smooth animations
 * Inspired by Tony Stark's arc reactor from the Marvel Cinematic Universe
 */
export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow field */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 12,
          height: size + 12,
          background: 'radial-gradient(circle, rgba(0, 180, 255, 0.25) 0%, transparent 70%)',
          animation: 'arc-reactor-outer-glow 3s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor - Iron Man Movie Style */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.5))' }}
      >
        <defs>
          {/* Core Gradients */}
          <radialGradient id="arcCoreGradientMain" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#c8f0ff" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="75%" stopColor="#0096ff" />
            <stop offset="100%" stopColor="#0066cc" />
          </radialGradient>
          
          <radialGradient id="arcCoreGlowMain" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="40%" stopColor="rgba(0, 220, 255, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          <linearGradient id="arcRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#00b4ff" />
            <stop offset="100%" stopColor="#0096ff" />
          </linearGradient>
          
          {/* Glow Filters */}
          <filter id="arcGlowMain" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="arcStrongGlowMain" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Decorative Ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(0, 150, 255, 0.15)"
          strokeWidth="1"
        />
        
        {/* Outer Ring - 10 Triangular Segments (Rotating Slow) */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate-slow 20s linear infinite' }}>
          {[...Array(10)].map((_, i) => (
            <path
              key={`outer-seg-${i}`}
              d={`M 50 3 L 52 10 L 48 10 Z`}
              fill="rgba(0, 200, 255, 0.7)"
              transform={`rotate(${i * 36}, 50, 50)`}
              style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
            />
          ))}
        </g>
        
        {/* Middle Ring - Counter Rotating */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate-reverse 15s linear infinite' }}>
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(0, 180, 255, 0.4)"
            strokeWidth="1.5"
          />
          {[...Array(10)].map((_, i) => (
            <path
              key={`mid-seg-${i}`}
              d={`M 50 12 L 51.5 16 L 48.5 16 Z`}
              fill="rgba(0, 220, 255, 0.85)"
              transform={`rotate(${i * 36 + 18}, 50, 50)`}
              style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
            />
          ))}
        </g>
        
        {/* Inner Frame Ring */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="rgba(0, 180, 255, 0.5)"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 200, 255, 0.6))' }}
        />
        
        {/* Rotating Inner Segments */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate 8s linear infinite' }}>
          {[...Array(10)].map((_, i) => (
            <path
              key={`inner-seg-${i}`}
              d={`M 50 22 L 51 26 L 49 26 Z`}
              fill="rgba(0, 220, 255, 0.9)"
              transform={`rotate(${i * 36}, 50, 50)`}
              style={{ filter: 'drop-shadow(0 0 2px rgba(0, 220, 255, 0.8))' }}
            />
          ))}
        </g>
        
        {/* Core Frame Ring */}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="rgba(0, 200, 255, 0.6)"
          strokeWidth="2.5"
          style={{ 
            filter: 'drop-shadow(0 0 6px rgba(0, 200, 255, 0.7))',
            animation: 'arc-reactor-pulse-ring 2s ease-in-out infinite'
          }}
        />
        
        {/* Main Core Outer Glow */}
        <circle
          cx="50"
          cy="50"
          r="16"
          fill="url(#arcCoreGlowMain)"
          style={{ animation: 'arc-reactor-core-glow 2s ease-in-out infinite' }}
        />
        
        {/* Main Core */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#arcCoreGradientMain)"
          filter="url(#arcStrongGlowMain)"
          style={{ animation: 'arc-reactor-inner-pulse 1.5s ease-in-out infinite' }}
        />
        
        {/* Core Bright Center */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="#ffffff"
          filter="url(#arcStrongGlowMain)"
        />
        
        {/* Core Highlight */}
        <circle
          cx="47"
          cy="47"
          r="3"
          fill="rgba(255, 255, 255, 0.9)"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Orbiting Energy Particles */}
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate 6s linear infinite' }}>
          <circle cx="50" cy="6" r="2" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 220, 255, 1))' }} />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate-reverse 8s linear infinite' }}>
          <circle cx="94" cy="50" r="1.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 200, 255, 1))' }} />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'arc-reactor-rotate 10s linear infinite' }}>
          <circle cx="50" cy="94" r="1.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 180, 255, 1))' }} />
        </g>
      </svg>
      
      {/* Text label if needed */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00b4ff' }}>
            JARVIS
          </span>
        </div>
      )}
      
      {/* Embedded CSS Animations */}
      <style jsx>{`
        @keyframes arc-reactor-outer-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes arc-reactor-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-reactor-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes arc-reactor-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes arc-reactor-pulse-ring {
          0%, 100% { 
            opacity: 0.6;
            stroke-width: 2.5;
          }
          50% { 
            opacity: 1;
            stroke-width: 3;
          }
        }
        
        @keyframes arc-reactor-core-glow {
          0%, 100% { 
            opacity: 0.8;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes arc-reactor-inner-pulse {
          0%, 100% { 
            opacity: 0.9;
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
