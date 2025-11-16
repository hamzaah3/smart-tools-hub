'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type PDFToolId = 'merge' | 'split' | 'compress' | 'rotate' | 'pdf-to-image';

interface PDFToolsProps {
  onClose: () => void;
  initialToolId?: PDFToolId;
}

export function PDFTools({ onClose, initialToolId }: PDFToolsProps) {
  const [selectedTool, setSelectedTool] = useState<PDFToolId | null>(initialToolId ?? null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitRange, setSplitRange] = useState({ start: '1', end: '' });
  const [rotationAngle, setRotationAngle] = useState('90');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');

  const tools: Array<{ id: PDFToolId; name: string; description: string }> = [
    { id: 'merge', name: 'Merge PDFs', description: 'Combine multiple PDF files' },
    { id: 'split', name: 'Split PDF', description: 'Extract pages from PDF' },
    { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size' },
    { id: 'rotate', name: 'Rotate PDF', description: 'Rotate PDF pages' },
    { id: 'pdf-to-image', name: 'PDF to Image', description: 'Convert PDF to images' },
  ];

  useEffect(() => {
    if (initialToolId) {
      setSelectedTool(initialToolId);
      setFiles(null);
      setSplitRange({ start: '1', end: '' });
      setRotationAngle('90');
      setImageFormat('png');
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

    if (selectedTool === 'split') {
      const start = parseInt(splitRange.start, 10);
      const end = splitRange.end ? parseInt(splitRange.end, 10) : undefined;

      if (Number.isNaN(start) || start < 1) {
        toast.error('Enter a valid start page (>= 1)');
        return;
      }

      if (end !== undefined && (Number.isNaN(end) || end < start)) {
        toast.error('End page must be greater than or equal to start page');
        return;
      }
    }

    setIsProcessing(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    if (selectedTool === 'split') {
      formData.append('startPage', splitRange.start || '1');
      if (splitRange.end) {
        formData.append('endPage', splitRange.end);
      }
    }

    if (selectedTool === 'rotate') {
      formData.append('rotation', rotationAngle);
    }

    if (selectedTool === 'pdf-to-image') {
      formData.append('options', JSON.stringify({ format: imageFormat === 'jpg' ? 'jpeg' : imageFormat }));
    }

    try {
      const response = await fetch(`/api/pdf/${selectedTool}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const firstFile = files[0];
      const baseName = firstFile ? firstFile.name.replace(/\.[^/.]+$/, '') : 'processed';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      if (selectedTool === 'pdf-to-image') {
        a.download = `${baseName || 'processed'}-images.zip`;
      } else {
        a.download = `processed_${selectedTool}.pdf`;
      }

      a.click();
      
      toast.success('PDF processed successfully!');
    } catch {
      toast.error('Failed to process PDF');
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
              📄 {currentTool ? currentTool.name : 'PDF Tools'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentTool ? currentTool.description : 'Pick a PDF action, then upload your files.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        {!initialToolId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  setFiles(null);
                  setSplitRange({ start: '1', end: '' });
                  setRotationAngle('90');
                  setImageFormat('png');
                }}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  selectedTool === tool.id
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <h3 className="font-semibold mb-1">{tool.name}</h3>
                <p className="text-sm text-slate-500">{tool.description}</p>
              </button>
            ))}
          </div>
        )}

        {selectedTool && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
            <input
              type="file"
              accept=".pdf"
              multiple={selectedTool === 'merge'}
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg font-medium mb-2">Drop PDF files here or click to browse</p>
              <p className="text-sm text-slate-500">Maximum file size: 50MB</p>
            </label>
            {files && <p className="mt-4 text-green-600">{files.length} file(s) selected</p>}
          </div>
        )}

        {selectedTool === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="number"
              min={1}
              value={splitRange.start}
              onChange={(e) => setSplitRange((prev) => ({ ...prev, start: e.target.value }))}
              placeholder="Start page"
              className="p-3 border border-slate-200 rounded-lg"
            />
            <input
              type="number"
              min={1}
              value={splitRange.end}
              onChange={(e) => setSplitRange((prev) => ({ ...prev, end: e.target.value }))}
              placeholder="End page (optional)"
              className="p-3 border border-slate-200 rounded-lg"
            />
          </div>
        )}

        {selectedTool === 'rotate' && (
          <div className="mb-6">
            <label className="block mb-2 font-medium">Rotation angle</label>
            <select
              value={rotationAngle}
              onChange={(e) => setRotationAngle(e.target.value)}
              className="p-3 border border-slate-200 rounded-lg"
            >
              <option value="90">90° Clockwise</option>
              <option value="180">180°</option>
              <option value="270">270° Counterclockwise</option>
            </select>
          </div>
        )}

        {selectedTool === 'pdf-to-image' && (
          <div className="mb-6">
            <label className="block mb-2 font-medium">Image format</label>
            <select
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
              className="p-3 border border-slate-200 rounded-lg"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
        )}

        {files && (
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="mt-6 w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300"
          >
            {isProcessing ? 'Processing...' : 'Process PDF'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
