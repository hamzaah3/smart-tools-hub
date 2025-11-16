'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type CSVToolId = 'preview' | 'to-json' | 'clean' | 'merge';

interface CSVToolsProps {
  onClose: () => void;
  initialToolId?: CSVToolId;
}

export function CSVTools({ onClose, initialToolId }: CSVToolsProps) {
  const [selectedTool, setSelectedTool] = useState<CSVToolId | null>(initialToolId ?? null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);

  const tools: Array<{ id: CSVToolId; name: string; description: string }> = [
    { id: 'preview', name: 'Preview CSV', description: 'View CSV data' },
    { id: 'to-json', name: 'CSV to JSON', description: 'Convert to JSON' },
    { id: 'clean', name: 'Clean Data', description: 'Remove empty rows' },
    { id: 'merge', name: 'Merge CSVs', description: 'Combine files' },
  ];

  useEffect(() => {
    if (initialToolId) {
      setSelectedTool(initialToolId);
      setFiles(null);
      setPreview([]);
    }
  }, [initialToolId]);

  const currentTool = selectedTool
    ? tools.find((tool) => tool.id === selectedTool)
    : null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      if (selectedTool === 'preview') {
        handlePreview(e.target.files[0]);
      }
    }
  };

  const handlePreview = async (csvFile: File) => {
    const text = await csvFile.text();
    const rows = text.split('\n').slice(0, 10).map(row => row.split(','));
    setPreview(rows);
  };

  const handleProcess = async () => {
    if (!files || files.length === 0 || !selectedTool) {
      toast.error('Please select a file and tool');
      return;
    }

    if (selectedTool === 'merge' && files.length < 2) {
      toast.error('Select at least two CSV files to merge');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    if (selectedTool === 'merge') {
      Array.from(files).forEach((csvFile) => formData.append('files', csvFile));
    } else {
      formData.append('file', files[0]);
    }

    try {
      const response = await fetch(`/api/csv/${selectedTool}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      if (selectedTool === 'to-json') {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedTool === 'merge' ? 'merged.csv' : 'processed.csv';
        a.click();
      }

      toast.success('CSV processed successfully!');
    } catch {
      toast.error('Failed to process CSV');
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
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold">
              📊 {currentTool ? currentTool.name : 'CSV Tools'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentTool ? currentTool.description : 'Choose a CSV action, then upload your files.'}
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
                  setFiles(null);
                  setPreview([]);
                }}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  selectedTool === tool.id ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <h3 className="font-semibold mb-1 text-sm">{tool.name}</h3>
                <p className="text-xs text-slate-500">{tool.description}</p>
              </button>
            ))}
          </div>
        )}

        {selectedTool && (
            <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
            <input
              type="file"
              accept=".csv"
              multiple={selectedTool === 'merge'}
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium mb-2">Drop CSV file here or click to browse</p>
              {files && (
                <p className="mt-4 text-green-600">
                  {selectedTool === 'merge'
                    ? `${files.length} file(s) selected`
                    : files[0]?.name}
                </p>
              )}
            </label>
          </div>
        )}

        {preview.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    {row.map((cell, j) => (
                      <td key={j} className="p-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {files && selectedTool !== 'preview' && (
          <button onClick={handleProcess} disabled={isProcessing} className="w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300">
            {isProcessing ? 'Processing...' : 'Process CSV'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
