'use client';

import React from 'react';

interface SystemStatusProps {
  translations: {
    cpu: string;
    memory: string;
    storage: string;
    gpu: string;
  };
}

function ProgressRing({ value, color, size = 64, strokeWidth = 3 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="jarvis-progress-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(14, 26, 58, 0.8)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 1s ease-in-out',
          filter: `drop-shadow(0 0 4px ${color}40)`,
        }}
      />
    </svg>
  );
}

function SystemStatusItem({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl jarvis-animate-fade-in"
      style={{ animationDelay: `${delay}ms`, background: 'rgba(8, 14, 30, 0.6)', border: '1px solid #0e1a3a' }}>
      <div className="relative">
        <ProgressRing value={value} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[12px] font-bold tracking-wider" style={{ color: color }}>
            {value}%
          </span>
        </div>
      </div>
      <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.6)' }}>
        {label}
      </span>
    </div>
  );
}

export default function SystemStatus({ translations }: SystemStatusProps) {
  const statusItems = [
    { label: translations.cpu, value: 42, color: '#00e5ff' },
    { label: translations.memory, value: 67, color: '#0088cc' },
    { label: translations.storage, value: 23, color: '#10b981' },
    { label: translations.gpu, value: 85, color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statusItems.map((item, idx) => (
        <SystemStatusItem
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
          delay={800 + idx * 100}
        />
      ))}
    </div>
  );
}
