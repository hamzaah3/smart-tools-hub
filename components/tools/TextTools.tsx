'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface TextToolsProps {
  onClose: () => void;
}

type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle';

export function TextTools({ onClose }: TextToolsProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [caseMode, setCaseMode] = useState<CaseMode>('upper');

  const tools = [
    { id: 'word-count', name: 'Word Counter', description: 'Count words & characters' },
    { id: 'case', name: 'Case Converter', description: 'Change text case' },
    { id: 'json', name: 'JSON Formatter', description: 'Format & validate JSON' },
    { id: 'qr', name: 'QR Generator', description: 'Create QR codes' },
  ];

  const handleProcess = async () => {
    if (!selectedTool) {
      toast.error('Select a tool to process your text');
      return;
    }

    if (!text.trim()) {
      toast.error('Enter text to process');
      return;
    }

    switch (selectedTool) {
      case 'word-count':
        try {
          const response = await fetch('/api/text/word-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, includeReadTime: true }),
          });

          if (!response.ok) {
            throw new Error();
          }

          const data = await response.json();
          const metrics = data.metrics;
          const lines = [
            `Words: ${metrics.words}`,
            `Characters: ${metrics.characters}`,
            `Sentences: ${metrics.sentences}`,
            `Paragraphs: ${metrics.paragraphs}`,
            `Average words per sentence: ${metrics.averageWordsPerSentence.toFixed(2)}`,
            `Average words per paragraph: ${metrics.averageWordsPerParagraph.toFixed(2)}`,
            metrics.readTimeMinutes ? `Estimated reading time: ~${metrics.readTimeMinutes} min` : '',
          ].filter(Boolean);
          setResult(lines.join('\n'));
          toast.success('Word analysis complete!');
        } catch {
          toast.error('Failed to analyze text');
        }
        break;
      case 'case':
        try {
          const response = await fetch('/api/text/case', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, mode: caseMode }),
          });

          if (!response.ok) {
            throw new Error();
          }

          const data = await response.json();
          setResult(data.result);
          toast.success('Text converted!');
        } catch {
          toast.error('Failed to convert text');
        }
        break;
      case 'json':
        try {
          const formatted = JSON.stringify(JSON.parse(text), null, 2);
          setResult(formatted);
          toast.success('Valid JSON!');
        } catch {
          toast.error('Invalid JSON');
        }
        break;
      case 'qr':
        generateQR();
        break;
    }
  };

  const generateQR = async () => {
    try {
      if (!text.trim()) {
        toast.error('Enter text to generate QR code');
        return;
      }

      const response = await fetch('/api/text/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      toast.success('QR code downloaded!');
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="w-full max-h-[90vh] max-w-4xl rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📝 Text Tools</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool.id);
                setText('');
                setResult('');
                setCaseMode('upper');
              }}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedTool === tool.id ? 'border-fuchsia-300 bg-fuchsia-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <h3 className="font-semibold mb-1 text-sm">{tool.name}</h3>
              <p className="text-xs text-slate-500">{tool.description}</p>
            </button>
          ))}
        </div>

        {selectedTool && (
          <>
            {selectedTool === 'case' && (
              <div className="mb-4">
                <label className="block mb-2 font-medium text-sm">Select case style</label>
                <select
                  value={caseMode}
                  onChange={(e) => setCaseMode(e.target.value as CaseMode)}
                  className="w-full rounded-lg border border-slate-200 p-3"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case</option>
                  <option value="sentence">Sentence case</option>
                  <option value="toggle">tOgGlE cAsE</option>
                </select>
              </div>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="mb-4 h-40 w-full rounded-lg border border-slate-200 p-4"
            />
            <button onClick={handleProcess} className="mb-4 w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700">
              Process
            </button>
            {result && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
