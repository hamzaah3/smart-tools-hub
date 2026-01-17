'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputPanel({ label, value, onChange, placeholder }: InputPanelProps) {
  const lineCount = value.split('\n').length;
  const charCount = value.length;

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onChange(text);
      toast.success(`File "${file.name}" loaded`);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  }, [onChange]);

  const handleClear = () => {
    onChange('');
    toast.info(`${label} cleared`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      toast.success('Text pasted from clipboard');
    } catch (error) {
      toast.error('Failed to paste from clipboard');
    }
  };

  return (
    <Card className="overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            {label}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <label htmlFor={`file-${label}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                asChild
                title="Upload file"
              >
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
              <input
                id={`file-${label}`}
                type="file"
                accept=".txt,.md,.js,.ts,.jsx,.tsx,.css,.html,.json,.xml,.log"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-30"
              onClick={handleClear}
              disabled={!value}
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">
          {lineCount} lines • {charCount} characters
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[400px] font-mono text-sm resize-none border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 shadow-inner transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-400/30 dark:focus-visible:ring-blue-500/40 focus-visible:border-blue-400 dark:focus-visible:border-blue-500"
          spellCheck={false}
        />
      </CardContent>
    </Card>
  );
}
