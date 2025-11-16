'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type ImageToolId = 'convert' | 'resize' | 'compress' | 'base64';

interface ImageToolsProps {
  onClose: () => void;
  initialToolId?: ImageToolId;
}

export function ImageTools({ onClose, initialToolId }: ImageToolsProps) {
  const [selectedTool, setSelectedTool] = useState<ImageToolId | null>(initialToolId ?? null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [options, setOptions] = useState({ format: 'png', width: '', height: '', quality: 80 });
  const [isProcessing, setIsProcessing] = useState(false);

  const tools: Array<{ id: ImageToolId; name: string; description: string }> = [
    { id: 'convert', name: 'Convert Format', description: 'JPG, PNG, WEBP, AVIF' },
    { id: 'resize', name: 'Resize Image', description: 'Change dimensions' },
    { id: 'compress', name: 'Compress', description: 'Reduce file size' },
    { id: 'base64', name: 'Base64 Encode', description: 'Convert to Base64' },
  ];

  useEffect(() => {
    if (initialToolId) {
      setSelectedTool(initialToolId);
      setFiles(null);
      setOptions({ format: 'png', width: '', height: '', quality: 80 });
    }
  }, [initialToolId]);

  const currentTool = selectedTool
    ? tools.find((tool) => tool.id === selectedTool)
    : null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleProcess = async () => {
    if (!files || !selectedTool) {
      toast.error('Please select files and a tool');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    formData.append('options', JSON.stringify(options));

    try {
      const response = await fetch(`/api/image/${selectedTool}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      if (selectedTool === 'base64') {
        const data = await response.json();
        navigator.clipboard.writeText(data.base64);
        toast.success('Base64 copied to clipboard!');
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed.${options.format}`;
        a.click();
        toast.success('Image processed successfully!');
      }
    } catch {
      toast.error('Failed to process image');
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
              🖼️ {currentTool ? currentTool.name : 'Image Tools'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentTool ? currentTool.description : 'Choose what you want to do, then add your images.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        {!initialToolId && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  selectedTool === tool.id ? 'border-sky-300 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <h3 className="font-semibold mb-1 text-sm">{tool.name}</h3>
                <p className="text-xs text-slate-500">{tool.description}</p>
              </button>
            ))}
          </div>
        )}

        {selectedTool && (
          <>
            <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-lg font-medium mb-2">Drop images here or click to browse</p>
                <p className="text-sm text-slate-500">Maximum file size: 25MB</p>
              </label>
              {files && <p className="mt-4 text-green-600">{files.length} file(s) selected</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {selectedTool === 'convert' && (
                <select value={options.format} onChange={(e) => setOptions({...options, format: e.target.value})} className="p-2 border border-slate-200 rounded-lg">
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="avif">AVIF</option>
                </select>
              )}
              {selectedTool === 'resize' && (
                <>
                  <input type="number" placeholder="Width (px)" value={options.width} onChange={(e) => setOptions({...options, width: e.target.value})} className="p-2 border border-slate-200 rounded-lg" />
                  <input type="number" placeholder="Height (px)" value={options.height} onChange={(e) => setOptions({...options, height: e.target.value})} className="p-2 border border-slate-200 rounded-lg" />
                </>
              )}
              {selectedTool === 'compress' && (
                <div className="col-span-2">
                  <label className="block mb-2">Quality: {options.quality}%</label>
                  <input type="range" min="10" max="100" value={options.quality} onChange={(e) => setOptions({...options, quality: parseInt(e.target.value)})} className="w-full" />
                </div>
              )}
            </div>
          </>
        )}

        {files && (
          <button onClick={handleProcess} disabled={isProcessing} className="w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300">
            {isProcessing ? 'Processing...' : 'Process Image'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
