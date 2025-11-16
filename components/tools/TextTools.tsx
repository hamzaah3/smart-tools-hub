'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type TextToolId = 'word-count' | 'case' | 'json';

interface TextToolsProps {
  onClose: () => void;
  initialToolId?: TextToolId;
}

type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle';

export function TextTools({ onClose, initialToolId }: TextToolsProps) {
  const [selectedTool, setSelectedTool] = useState<TextToolId | null>(initialToolId ?? null);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [caseMode, setCaseMode] = useState<CaseMode>('upper');


  const tools: Array<{ id: TextToolId; name: string; description: string }> = [
    { id: 'word-count', name: 'Word Counter', description: 'Count words & characters' },
    { id: 'case', name: 'Case Converter', description: 'Change text case' },
    { id: 'json', name: 'JSON Formatter', description: 'Format & validate JSON' },
  ];

  useEffect(() => {
    if (initialToolId) {
      setSelectedTool(initialToolId);
      setText('');
      setResult('');
      setCaseMode('upper');
    }
  }, [initialToolId]);

  const currentTool = selectedTool
    ? tools.find((tool) => tool.id === selectedTool)
    : null;

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
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold">
              📝 {currentTool ? currentTool.name : 'Text Tools'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentTool ? currentTool.description : 'Pick a text helper, paste your content, and run it.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        {!initialToolId && (
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
        )}

        {selectedTool && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
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
              <label className="mb-2 text-sm font-medium text-slate-700">Input</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here..."
                className="h-60 w-full flex-1 rounded-lg border border-slate-200 p-4 text-sm font-mono"
              />
              <button
                onClick={handleProcess}
                className="mt-3 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Run tool
              </button>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-slate-700">Result</label>
              <div className="h-60 w-full flex-1 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
                {result ? (
                  <pre className="h-full w-full overflow-auto whitespace-pre-wrap font-mono text-slate-800">
                    {result}
                  </pre>
                ) : (
                  <p className="h-full text-sm text-slate-400 flex items-center justify-center text-center">
                    Run the tool to see the output here.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
