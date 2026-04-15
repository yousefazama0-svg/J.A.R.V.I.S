'use client';

import React from 'react';

interface ArcReactorLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function ArcReactorLogo({ size = 40, className = '', showText = false }: ArcReactorLogoProps) {
  const scale = size / 40;
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer ring with segments */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        className="absolute"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Outer ring */}
        <circle
          cx="20"
          cy="20"
          r="19"
          fill="none"
          stroke="rgba(0, 229, 255, 0.15)"
          strokeWidth="0.5"
        />
        
        {/* Rotating arc segments */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate 8s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeDasharray="8 100"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="#7c5cff"
            strokeWidth="1.5"
            strokeDasharray="6 100"
            strokeDashoffset="-35"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
        
        {/* Middle ring */}
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="rgba(0, 229, 255, 0.2)"
          strokeWidth="0.5"
        />
        
        {/* Inner rotating ring */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate-reverse 6s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1"
            strokeDasharray="10 65"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>
        
        {/* Core ring */}
        <circle
          cx="20"
          cy="20"
          r="8"
          fill="none"
          stroke="rgba(0, 229, 255, 0.3)"
          strokeWidth="0.5"
        />
        
        {/* Core glow */}
        <circle
          cx="20"
          cy="20"
          r="6"
          fill="url(#reactorGradient)"
          style={{ filter: 'url(#reactorGlow)' }}
        />
        
        {/* Center dot */}
        <circle
          cx="20"
          cy="20"
          r="3"
          fill="#00f0ff"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.8))',
            animation: 'jarvis-pulse-core 2s ease-in-out infinite'
          }}
        />
        
        {/* Gradients and filters */}
        <defs>
          <radialGradient id="reactorGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="reactorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Text label if needed */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00e5ff' }}>
            JARVIS
          </span>
        </div>
      )}
    </div>
  );
}
