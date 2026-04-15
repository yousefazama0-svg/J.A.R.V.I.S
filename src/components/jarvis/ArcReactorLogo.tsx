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
      {/* Outer energy field glow */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 10,
          height: size + 10,
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
          animation: 'jarvis-energy-field 3s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.3))' }}
      >
        {/* Outer ring - segmented */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate 10s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="19"
            fill="none"
            stroke="url(#outerRingGradient)"
            strokeWidth="2"
            strokeDasharray="5 10"
            strokeLinecap="round"
          />
        </g>
        
        {/* Second ring - rotating segments */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate-reverse 7s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="url(#secondRingGradient)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            strokeLinecap="round"
          />
        </g>
        
        {/* Third ring - energy pulses */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate 5s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="url(#thirdRingGradient)"
            strokeWidth="2"
            strokeDasharray="12 8"
            strokeLinecap="round"
          />
        </g>
        
        {/* Inner frame ring */}
        <circle
          cx="20"
          cy="20"
          r="11"
          fill="none"
          stroke="rgba(0, 229, 255, 0.5)"
          strokeWidth="2"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.5))'
          }}
        />
        
        {/* Inner rotating decorative ring */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate-reverse 3s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="11"
            fill="none"
            stroke="url(#innerDecoGradient)"
            strokeWidth="2"
            strokeDasharray="3 14"
            strokeLinecap="round"
          />
        </g>
        
        {/* Core outer glow */}
        <circle
          cx="20"
          cy="20"
          r="8"
          fill="url(#coreGradient)"
          style={{ filter: 'url(#coreGlow)' }}
        />
        
        {/* Core inner */}
        <circle
          cx="20"
          cy="20"
          r="5"
          fill="url(#coreInnerGradient)"
          style={{ 
            filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))',
            animation: 'jarvis-pulse-core-enhanced 1.5s ease-in-out infinite'
          }}
        />
        
        {/* Core highlight */}
        <circle
          cx="18"
          cy="18"
          r="2"
          fill="rgba(255, 255, 255, 0.9)"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Orbiting particles */}
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate 4s linear infinite' }}>
          <circle cx="20" cy="3" r="1.5" fill="#00f0ff" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 240, 255, 0.8))' }} />
        </g>
        <g style={{ transformOrigin: '20px 20px', animation: 'jarvis-rotate-reverse 6s linear infinite' }}>
          <circle cx="37" cy="20" r="1" fill="#7c5cff" style={{ filter: 'drop-shadow(0 0 2px rgba(124, 92, 255, 0.8))' }} />
        </g>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.6)" />
            <stop offset="50%" stopColor="rgba(124, 92, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 229, 255, 0.6)" />
          </linearGradient>
          
          <linearGradient id="secondRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.8)" />
            <stop offset="33%" stopColor="rgba(124, 92, 255, 0.5)" />
            <stop offset="66%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 240, 255, 0.8)" />
          </linearGradient>
          
          <linearGradient id="thirdRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 255, 0.9)" />
            <stop offset="50%" stopColor="rgba(124, 92, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(0, 255, 255, 0.9)" />
          </linearGradient>
          
          <linearGradient id="innerDecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 1)" />
            <stop offset="25%" stopColor="rgba(0, 240, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(124, 92, 255, 0.8)" />
            <stop offset="75%" stopColor="rgba(124, 92, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 240, 255, 1)" />
          </linearGradient>
          
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(0, 240, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 229, 255, 0.1)" />
          </radialGradient>
          
          <radialGradient id="coreInnerGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="rgba(0, 255, 255, 0.95)" />
            <stop offset="70%" stopColor="rgba(0, 240, 255, 0.7)" />
            <stop offset="100%" stopColor="rgba(0, 229, 255, 0.3)" />
          </radialGradient>
          
          <filter id="coreGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
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
