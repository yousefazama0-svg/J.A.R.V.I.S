'use client';

import React, { useState, useEffect } from 'react';
import ArcReactor from '@/components/tools/ArcReactor';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: '#050810' }}>
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 180, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Radial Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #050810 70%)'
        }}
      />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            background: `rgba(0, ${150 + Math.random() * 100}, 255, ${Math.random() * 0.5 + 0.2})`,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `-${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Arc Reactor */}
        <ArcReactor />

        {/* Title */}
        <div className="mt-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl font-black tracking-[0.3em] mb-2"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #00b4ff, #ffffff, #00d4ff)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          >
            J.A.R.V.I.S
          </h1>
          <p 
            className="text-sm tracking-[0.4em] uppercase"
            style={{ color: 'rgba(0, 180, 255, 0.5)' }}
          >
            Arc Reactor System
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-8 mt-12">
          {[
            { label: 'POWER', value: '100%', color: '#00d4ff' },
            { label: 'CORE', value: 'STABLE', color: '#00ff88' },
            { label: 'STATUS', value: 'ONLINE', color: '#00d4ff' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div 
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: 'rgba(144, 168, 204, 0.5)' }}
              >
                {item.label}
              </div>
              <div 
                className="text-sm font-bold tracking-wider"
                style={{ color: item.color, textShadow: `0 0 10px ${item.color}50` }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pulse Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: 'rgba(0, 212, 255, 0.1)',
                width: `${i * 150}px`,
                height: `${i * 150}px`,
                animation: `pulseRing ${3 + i}s ease-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
          Powered by Z.AI • Arc Reactor Technology
        </p>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
        }
        
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(50px) translateY(50px); }
        }
        
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
