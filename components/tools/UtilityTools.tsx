'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type UtilityToolId = 'password' | 'url' | 'color' | 'unit';
type Unit = 'kg' | 'lb' | 'cm' | 'in';

interface UtilityToolsProps {
  onClose: () => void;
  initialToolId?: UtilityToolId;
}

export function UtilityTools({ onClose, initialToolId }: UtilityToolsProps) {
  const [selectedTool, setSelectedTool] = useState<UtilityToolId | null>(initialToolId ?? null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fromUnit, setFromUnit] = useState<Unit>('kg');
  const [toUnit, setToUnit] = useState<Unit>('lb');

  const unitOptions: Array<{ value: Unit; label: string }> = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'cm', label: 'Centimeters (cm)' },
    { value: 'in', label: 'Inches (in)' },
  ];

  const supportedUnitPairs: Array<{ from: Unit; to: Unit }> = [
    { from: 'kg', to: 'lb' },
    { from: 'lb', to: 'kg' },
    { from: 'cm', to: 'in' },
    { from: 'in', to: 'cm' },
  ];

  const availableToUnits = unitOptions.filter((to) =>
    supportedUnitPairs.some((pair) => pair.from === fromUnit && pair.to === to.value)
  );

  const tools: Array<{ id: UtilityToolId; name: string; description: string }> = [
    { id: 'password', name: 'Password Generator', description: 'Generate secure passwords' },
    { id: 'url', name: 'URL Encoder/Decoder', description: 'Encode/decode URLs' },
    { id: 'color', name: 'Color Converter', description: 'HEX ↔ RGB' },
    { id: 'unit', name: 'Unit Converter', description: 'Convert measurements' },
  ];

  useEffect(() => {
    if (initialToolId) {
      setSelectedTool(initialToolId);
      setInput('');
      setResult('');
      if (initialToolId === 'unit') {
        setFromUnit('kg');
        setToUnit('lb');
      }
    }
  }, [initialToolId]);

  const currentTool = selectedTool
    ? tools.find((tool) => tool.id === selectedTool)
    : null;

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

          const isSupported = supportedUnitPairs.some(
            (pair) => pair.from === fromUnit && pair.to === toUnit
          );
          if (!isSupported) {
            toast.error('This unit combination is not supported yet');
            return;
          }

          response = await fetch('/api/utils/unit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: numericValue, from: fromUnit, to: toUnit }),
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
          <h2 className="text-2xl font-bold">
            🔧 {currentTool ? currentTool.name : 'Utility Tools'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        {!initialToolId && (
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
        )}

        {selectedTool && selectedTool !== 'password' && (
          <>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value..."
              className="mb-4 w-full rounded-lg border border-slate-200 p-4"
            />

            {selectedTool === 'unit' && (
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    From unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      const nextFrom = e.target.value as Unit;
                      setFromUnit(nextFrom);
                      // Ensure "to" is valid for the chosen "from"
                      const validTargets = supportedUnitPairs
                        .filter((pair) => pair.from === nextFrom)
                        .map((pair) => pair.to);
                      if (!validTargets.includes(toUnit)) {
                        setToUnit(validTargets[0]);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    To unit
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value as Unit)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm"
                  >
                    {availableToUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
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
