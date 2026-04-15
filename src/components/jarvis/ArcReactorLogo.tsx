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
      {/* Outer glow field */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size + 8,
          height: size + 8,
          background: 'radial-gradient(circle, rgba(0, 180, 255, 0.2) 0%, transparent 70%)',
          animation: 'arc-reactor-outer-glow 2s ease-in-out infinite'
        }}
      />
      
      {/* Main SVG Reactor - Iron Man Style */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        className="absolute"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0, 200, 255, 0.4))' }}
      >
        {/* Outer ring - 10 triangular segments */}
        <g style={{ transformOrigin: '20px 20px', animation: 'arc-reactor-rotate-slow 12s linear infinite' }}>
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(36, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(72, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(108, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(144, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(180, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(216, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(252, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(288, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
          <path
            d="M20 1 L22 6 L18 6 Z"
            fill="rgba(0, 200, 255, 0.8)"
            transform="rotate(324, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 0.6))' }}
          />
        </g>
        
        {/* Middle ring - counter rotating segments */}
        <g style={{ transformOrigin: '20px 20px', animation: 'arc-reactor-rotate-reverse 8s linear infinite' }}>
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="rgba(0, 200, 255, 0.5)"
            strokeWidth="2"
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(36, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(72, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(108, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(144, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(180, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(216, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(252, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(288, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
          <path
            d="M20 5 L21 8 L19 8 Z"
            fill="rgba(0, 220, 255, 0.9)"
            transform="rotate(324, 20, 20)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 0.8))' }}
          />
        </g>
        
        {/* Inner frame ring */}
        <circle
          cx="20"
          cy="20"
          r="11"
          fill="none"
          stroke="rgba(0, 180, 255, 0.6)"
          strokeWidth="2"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(0, 200, 255, 0.6))'
          }}
        />
        
        {/* Core outer glow */}
        <circle
          cx="20"
          cy="20"
          r="8"
          fill="url(#arcCoreGradient)"
          style={{ filter: 'url(#arcCoreGlow)' }}
        />
        
        {/* Core inner - bright blue-white */}
        <circle
          cx="20"
          cy="20"
          r="5"
          fill="url(#arcCoreInnerGradient)"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))',
            animation: 'arc-reactor-inner-pulse 1.5s ease-in-out infinite'
          }}
        />
        
        {/* Core highlight */}
        <circle
          cx="18"
          cy="18"
          r="2"
          fill="rgba(255, 255, 255, 0.95)"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Orbiting particles */}
        <g style={{ transformOrigin: '20px 20px', animation: 'arc-reactor-rotate 4s linear infinite' }}>
          <circle cx="20" cy="3" r="1.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 220, 255, 1))' }} />
        </g>
        <g style={{ transformOrigin: '20px 20px', animation: 'arc-reactor-rotate-reverse 6s linear infinite' }}>
          <circle cx="37" cy="20" r="1" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 2px rgba(0, 200, 255, 1))' }} />
        </g>
        
        {/* Gradients */}
        <defs>
          <radialGradient id="arcCoreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(0, 220, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 180, 255, 0.1)" />
          </radialGradient>
          
          <radialGradient id="arcCoreInnerGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="rgba(200, 240, 255, 1)" />
            <stop offset="60%" stopColor="rgba(0, 220, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(0, 180, 255, 0.5)" />
          </radialGradient>
          
          <filter id="arcCoreGlow" x="-100%" y="-100%" width="300%" height="300%">
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
          <span className="text-[8px] tracking-widest uppercase font-bold" style={{ color: '#00b4ff' }}>
            JARVIS
          </span>
        </div>
      )}
    </div>
  );
}
