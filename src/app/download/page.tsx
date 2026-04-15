'use client';

import { Download, FileArchive, HardDrive, Package } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#060a14' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
            style={{ background: 'linear-gradient(135deg, #00e5ff20, #7c5cff20)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
            <Package size={40} style={{ color: '#00e5ff' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#d0e4f8' }}>JARVIS Project</h1>
          <p className="text-sm" style={{ color: '#90a8cc' }}>Download the complete project files</p>
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          {/* Full Project */}
          <a 
            href="/jarvis-project-full.tar.gz"
            download
            className="block p-5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            style={{ 
              background: 'linear-gradient(135deg, #00e5ff10, #7c5cff10)', 
              border: '1px solid rgba(0, 229, 255, 0.2)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0, 229, 255, 0.1)' }}>
                <HardDrive size={24} style={{ color: '#00e5ff' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: '#d0e4f8' }}>Full Project</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" 
                    style={{ background: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff' }}>RECOMMENDED</span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#90a8cc' }}>Contains everything including node_modules</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(144, 168, 204, 0.1)', color: '#90a8cc' }}>745 MB</span>
                  <span className="text-xs" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>Ready to run</span>
                </div>
              </div>
              <Download size={20} style={{ color: '#00e5ff' }} />
            </div>
          </a>

          {/* Light Version */}
          <a 
            href="/jarvis-project.tar.gz"
            download
            className="block p-5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            style={{ 
              background: 'rgba(144, 168, 204, 0.05)', 
              border: '1px solid rgba(144, 168, 204, 0.1)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(144, 168, 204, 0.1)' }}>
                <FileArchive size={24} style={{ color: '#90a8cc' }} />
              </div>
              <div className="flex-1">
                <span className="font-bold block mb-1" style={{ color: '#d0e4f8' }}>Source Code Only</span>
                <p className="text-xs mb-2" style={{ color: '#90a8cc' }}>Without node_modules (need bun install)</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(144, 168, 204, 0.1)', color: '#90a8cc' }}>95 MB</span>
                  <span className="text-xs" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>Lighter download</span>
                </div>
              </div>
              <Download size={20} style={{ color: '#90a8cc' }} />
            </div>
          </a>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
          <p className="text-xs" style={{ color: '#f59e0b' }}>
            💡 <strong>After download:</strong> Extract the file, open terminal in the project folder, and run <code className="px-1.5 py-0.5 rounded mx-1" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>bun run dev</code>
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-xs hover:underline" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
            ← Back to JARVIS
          </a>
        </div>
      </div>
    </div>
  );
}
