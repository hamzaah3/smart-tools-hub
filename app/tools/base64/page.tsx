'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast.success('Encoded to Base64!');
    } catch (error) {
      toast.error('Failed to encode');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast.success('Decoded from Base64!');
    } catch (error) {
      toast.error('Invalid Base64 string');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    toast.info('Reset complete');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <h3 className="font-bold mb-3">Input</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or Base64..."
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Output</h3>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="min-h-[400px] font-mono text-sm bg-slate-50 dark:bg-slate-900"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button onClick={handleEncode} disabled={!input} size="lg">
          <Lock className="h-4 w-4 mr-2" />
          Encode
        </Button>
        <Button onClick={handleDecode} disabled={!input} variant="outline" size="lg">
          <Unlock className="h-4 w-4 mr-2" />
          Decode
        </Button>
      </div>
    </div>
  );
}
