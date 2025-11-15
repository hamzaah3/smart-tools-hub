'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface UtilityToolsProps {
  onClose: () => void;
}

export function UtilityTools({ onClose }: UtilityToolsProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tools = [
    { id: 'password', name: 'Password Generator', description: 'Generate secure passwords' },
    { id: 'url', name: 'URL Encoder/Decoder', description: 'Encode/decode URLs' },
    { id: 'color', name: 'Color Converter', description: 'HEX ↔ RGB' },
    { id: 'unit', name: 'Unit Converter', description: 'Convert measurements' },
  ];

  const handleProcess = async () => {
    if (!selectedTool) {
      toast.error('Select a tool to continue');
      return;
    }

    if (selectedTool !== 'password' && !input.trim()) {
      toast.error('Enter a value to process');
      return;
    }

    try {
      setIsProcessing(true);
      let response: Response;

      switch (selectedTool) {
        case 'password': {
          response = await fetch('/api/utils/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ length: 16 }),
          });

          if (!response.ok) throw new Error();

          const data = await response.json();
          setResult(data.password);
          await navigator.clipboard.writeText(data.password);
          toast.success('Password generated and copied!');
          break;
        }
        case 'url': {
          response = await fetch('/api/utils/url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
          });

          if (!response.ok) throw new Error();

          const data = await response.json();
          setResult(data.result);
          toast.success(`Text ${data.operation === 'decode' ? 'decoded' : 'encoded'}!`);
          break;
        }
        case 'color': {
          response = await fetch('/api/utils/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: input }),
          });

          if (!response.ok) throw new Error();

          const data = await response.json();
          setResult(
            [
              `HEX: ${data.conversions.hex}`,
              `RGB: ${data.conversions.rgb}`,
              `HSL: ${data.conversions.hsl}`,
            ].join('\n')
          );
          toast.success('Color converted!');
          break;
        }
        case 'unit': {
          const numericValue = Number.parseFloat(input);
          if (Number.isNaN(numericValue)) {
            toast.error('Enter a numeric value (e.g., 10)');
            return;
          }

          response = await fetch('/api/utils/unit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: numericValue, from: 'kg', to: 'lb' }),
          });

          if (!response.ok) throw new Error();

          const data = await response.json();
          setResult(data.formatted);
          toast.success('Value converted!');
          break;
        }
      }
    } catch {
      toast.error('Failed to process value');
    } finally {
      setIsProcessing(false);
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
          <h2 className="text-2xl font-bold">🔧 Utility Tools</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setSelectedTool(tool.id); setInput(''); setResult(''); }}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedTool === tool.id ? 'border-violet-300 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <h3 className="font-semibold mb-1 text-sm">{tool.name}</h3>
              <p className="text-xs text-slate-500">{tool.description}</p>
            </button>
          ))}
        </div>

        {selectedTool && selectedTool !== 'password' && (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter value..."
            className="mb-4 w-full rounded-lg border border-slate-200 p-4"
          />
        )}

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="mb-4 w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300"
        >
          {isProcessing ? 'Processing...' : selectedTool === 'password' ? 'Generate Password' : 'Convert'}
        </button>

        {result && (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}
