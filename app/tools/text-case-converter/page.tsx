'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Type, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function TextCaseConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convertCase = (type: string) => {
    let result = '';
    switch (type) {
      case 'upper':
        result = input.toUpperCase();
        break;
      case 'lower':
        result = input.toLowerCase();
        break;
      case 'title':
        result = input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case 'sentence':
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = input.toLowerCase().replace(/\s+/g, '_');
        break;
    }
    setOutput(result);
    toast.success('Text converted!');
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
            <h3 className="font-bold mb-3">Input Text</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Converted Text</h3>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Converted text will appear here..."
              className="min-h-[300px] bg-slate-50 dark:bg-slate-900"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button onClick={() => convertCase('upper')} disabled={!input}>
          UPPERCASE
        </Button>
        <Button onClick={() => convertCase('lower')} disabled={!input}>
          lowercase
        </Button>
        <Button onClick={() => convertCase('title')} disabled={!input}>
          Title Case
        </Button>
        <Button onClick={() => convertCase('sentence')} disabled={!input}>
          Sentence case
        </Button>
        <Button onClick={() => convertCase('camel')} disabled={!input}>
          camelCase
        </Button>
        <Button onClick={() => convertCase('snake')} disabled={!input}>
          snake_case
        </Button>
      </div>
    </div>
  );
}
