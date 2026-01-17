'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Braces, Copy, Download, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      toast.success('JSON formatted successfully!');
    } catch (error) {
      setIsValid(false);
      setOutput('');
      toast.error('Invalid JSON format');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      toast.success('JSON minified successfully!');
    } catch (error) {
      setIsValid(false);
      setOutput('');
      toast.error('Invalid JSON format');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    toast.info('Reset complete');
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!input && !output}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                <h3 className="font-bold">Input JSON</h3>
              </div>
              {isValid !== null && (
                <Badge variant={isValid ? 'default' : 'destructive'} className="text-xs">
                  {isValid ? '✓ Valid' : '✗ Invalid'}
                </Badge>
              )}
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="min-h-[400px] font-mono text-sm"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <h3 className="font-bold">Formatted Output</h3>
              </div>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="min-h-[400px] font-mono text-sm bg-slate-50 dark:bg-slate-900"
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button onClick={formatJSON} disabled={!input} size="lg">
          <Braces className="h-4 w-4 mr-2" />
          Format (Beautify)
        </Button>
        <Button onClick={minifyJSON} disabled={!input} variant="outline" size="lg">
          Minify
        </Button>
      </div>
    </div>
  );
}
