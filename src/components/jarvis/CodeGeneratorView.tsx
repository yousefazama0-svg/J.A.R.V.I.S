'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Code2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Trash2,
  Download,
  Settings2,
  FileCode,
  Play,
} from 'lucide-react';

type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'cpp' | 'go' | 'rust' | 'php' | 'ruby' | 'swift' | 'kotlin' | 'html' | 'css' | 'sql' | 'bash';

type CodeAction = 'generate' | 'explain' | 'optimize' | 'debug' | 'convert' | 'document';

const LANGUAGE_OPTIONS: { value: CodeLanguage; label: string; icon: string }[] = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C#', icon: '💜' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'swift', label: 'Swift', icon: '🍎' },
  { value: 'kotlin', label: 'Kotlin', icon: '🎯' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'sql', label: 'SQL', icon: '🗃️' },
  { value: 'bash', label: 'Bash', icon: '💻' },
];

const ACTION_OPTIONS: { value: CodeAction; label: string; desc: string }[] = [
  { value: 'generate', label: 'Generate', desc: 'Create new code' },
  { value: 'explain', label: 'Explain', desc: 'Understand code' },
  { value: 'optimize', label: 'Optimize', desc: 'Improve performance' },
  { value: 'debug', label: 'Debug', desc: 'Fix issues' },
  { value: 'convert', label: 'Convert', desc: 'Language convert' },
  { value: 'document', label: 'Document', desc: 'Add comments' },
];

interface CodeGeneratorViewProps {
  translations: {
    title: string;
    subtitle: string;
    enterPrompt: string;
    enterCode: string;
    generatedCode: string;
    generate: string;
    generating: string;
    language: string;
    action: string;
    copy: string;
    clear: string;
    download: string;
    run: string;
    inputCode: string;
  };
  language: 'en' | 'ar';
}

export default function CodeGeneratorView({ translations, language }: CodeGeneratorViewProps) {
  const [prompt, setPrompt] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('javascript');
  const [selectedAction, setSelectedAction] = useState<CodeAction>('generate');
  const [targetLanguage, setTargetLanguage] = useState<CodeLanguage>('python');
  const [showSettings, setShowSettings] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const generateCode = useCallback(async () => {
    if ((!prompt.trim() && !inputCode.trim()) || isGenerating) return;

    setIsGenerating(true);

    try {
      let instruction = '';
      
      switch (selectedAction) {
        case 'generate':
          instruction = `Generate ${selectedLanguage} code for: "${prompt}". Provide only the code, properly formatted.`;
          break;
        case 'explain':
          instruction = `Explain this ${selectedLanguage} code in detail:\n\`\`\`\n${inputCode}\n\`\`\`\n\nProvide a clear explanation of what it does.`;
          break;
        case 'optimize':
          instruction = `Optimize this ${selectedLanguage} code for better performance:\n\`\`\`\n${inputCode}\n\`\`\`\n\nProvide the optimized code with explanations of improvements.`;
          break;
        case 'debug':
          instruction = `Debug this ${selectedLanguage} code and fix any issues:\n\`\`\`\n${inputCode}\n\`\`\`\n\nProvide the fixed code with explanations.`;
          break;
        case 'convert':
          instruction = `Convert this ${selectedLanguage} code to ${targetLanguage}:\n\`\`\`\n${inputCode}\n\`\`\`\n\nProvide only the converted code.`;
          break;
        case 'document':
          instruction = `Add comprehensive documentation/comments to this ${selectedLanguage} code:\n\`\`\`\n${inputCode}\n\`\`\`\n\nProvide the documented code.`;
          break;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: instruction }],
          language: 'en'
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let result = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              result += parsed.content;
            }
          } catch { /* skip */ }
        }
      }

      setOutputCode(result.trim());

    } catch (error) {
      console.error('Code generation error:', error);
      setOutputCode('Error generating code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, inputCode, selectedLanguage, selectedAction, targetLanguage, isGenerating]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const downloadCode = useCallback(() => {
    const extensions: Record<CodeLanguage, string> = {
      javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
      csharp: 'cs', cpp: 'cpp', go: 'go', rust: 'rs', php: 'php',
      ruby: 'rb', swift: 'swift', kotlin: 'kt', html: 'html',
      css: 'css', sql: 'sql', bash: 'sh'
    };
    
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-${Date.now()}.${extensions[selectedLanguage]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [outputCode, selectedLanguage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #ec489920, #ec489910)', border: '1px solid #ec489930' }}>
            <Code2 size={14} style={{ color: '#ec4899' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.title}
            </span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: showSettings ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              border: `1px solid ${showSettings ? 'rgba(236, 72, 153, 0.2)' : 'transparent'}`,
            }}
          >
            <Settings2 size={12} style={{ color: showSettings ? '#ec4899' : '#90a8cc' }} />
          </button>
          <div className="jarvis-live">
            <div className="jarvis-live-dot" style={{ background: '#ec4899', boxShadow: '0 0 8px rgba(236, 72, 153, 0.5)' }} />
            <span style={{ color: '#ec4899' }}>Ready</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 jarvis-animate-fade-in" style={{ borderBottom: '1px solid #0e1a3a', background: 'rgba(0, 8, 20, 0.5)' }}>
          {/* Action Selection */}
          <div className="mb-3">
            <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.action}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {ACTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedAction(opt.value)}
                  className="px-2 py-1.5 rounded-lg text-[9px] transition-all text-left"
                  style={{
                    background: selectedAction === opt.value ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.04)',
                    border: `1px solid ${selectedAction === opt.value ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.1)'}`,
                    color: selectedAction === opt.value ? '#ec4899' : '#90a8cc',
                  }}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[8px] opacity-60">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.language}
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as CodeLanguage)}
                className="w-full px-2 py-1.5 rounded-lg text-[9px] outline-none"
                style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid #0e1a3a', color: '#d0e4f8' }}
              >
                {LANGUAGE_OPTIONS.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.icon} {lang.label}</option>
                ))}
              </select>
            </div>
            {selectedAction === 'convert' && (
              <div>
                <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  Target Language
                </span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as CodeLanguage)}
                  className="w-full px-2 py-1.5 rounded-lg text-[9px] outline-none"
                  style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid #0e1a3a', color: '#d0e4f8' }}
                >
                  {LANGUAGE_OPTIONS.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.icon} {lang.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Input Area */}
        <div className="jarvis-hud-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {selectedAction === 'generate' ? translations.enterPrompt : translations.inputCode}
            </span>
            <button
              onClick={() => { setPrompt(''); setInputCode(''); setOutputCode(''); }}
              disabled={!prompt && !inputCode}
              className="p-1 rounded transition-all"
              style={{ opacity: (prompt || inputCode) ? 1 : 0.3 }}
            >
              <Trash2 size={10} style={{ color: '#ef4444' }} />
            </button>
          </div>
          
          {selectedAction === 'generate' ? (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={translations.enterPrompt}
              rows={4}
              className="w-full bg-transparent text-[12px] outline-none resize-none leading-relaxed"
              style={{ color: '#d0e4f8', fontFamily: 'inherit' }}
            />
          ) : (
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={translations.enterCode}
              rows={6}
              className="w-full bg-transparent text-[12px] outline-none resize-none leading-relaxed font-mono"
              style={{ color: '#d0e4f8' }}
            />
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCode}
          disabled={(!prompt.trim() && !inputCode.trim()) || isGenerating}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: (prompt.trim() || inputCode.trim()) && !isGenerating
              ? 'linear-gradient(135deg, #ec4899, #db2777)'
              : 'rgba(236, 72, 153, 0.06)',
            border: `1px solid ${(prompt.trim() || inputCode.trim()) && !isGenerating ? 'rgba(236, 72, 153, 0.4)' : 'rgba(236, 72, 153, 0.1)'}`,
            color: (prompt.trim() || inputCode.trim()) && !isGenerating ? '#ffffff' : '#90a8cc',
            opacity: (prompt.trim() || inputCode.trim()) ? 1 : 0.5,
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {translations.generating}
            </>
          ) : (
            <>
              <Sparkles size={13} />
              {translations.generate}
            </>
          )}
        </button>

        {/* Output Code */}
        {(outputCode || isGenerating) && (
          <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: '#ec4899' }}>
                {translations.generatedCode}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(outputCode)}
                  disabled={!outputCode}
                  className="p-1 rounded transition-all"
                  style={{ opacity: outputCode ? 1 : 0.3 }}
                >
                  {copied ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#ec4899' }} />}
                </button>
                <button
                  onClick={downloadCode}
                  disabled={!outputCode}
                  className="p-1 rounded transition-all"
                  style={{ opacity: outputCode ? 1 : 0.3 }}
                >
                  <Download size={10} style={{ color: '#ec4899' }} />
                </button>
              </div>
            </div>
            {isGenerating ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 size={14} className="animate-spin" style={{ color: '#ec4899' }} />
                <span className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.generating}...
                </span>
              </div>
            ) : (
              <pre
                ref={codeRef}
                className="text-[11px] leading-relaxed overflow-x-auto font-mono p-3 rounded-lg"
                style={{ background: 'rgba(0, 0, 0, 0.3)', color: '#d0e4f8' }}
              >
                <code>{outputCode}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
