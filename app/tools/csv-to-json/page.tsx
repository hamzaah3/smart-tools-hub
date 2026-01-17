'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table2, Copy, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  const convertToJSON = () => {
    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) {
        toast.error('CSV must have at least header and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        result.push(obj);
      }

      setJsonOutput(JSON.stringify(result, null, 2));
      toast.success('Converted to JSON!');
    } catch (error) {
      toast.error('Failed to convert CSV');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    toast.success('Copied to clipboard!');
  };

  const handleReset = () => {
    setCsvInput('');
    setJsonOutput('');
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
            <h3 className="font-bold mb-3">CSV Input</h3>
            <Textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,London"
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">JSON Output</h3>
              {jsonOutput && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={jsonOutput}
              readOnly
              placeholder="JSON will appear here..."
              className="min-h-[400px] font-mono text-sm bg-slate-50 dark:bg-slate-900"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={convertToJSON} disabled={!csvInput} size="lg">
          <Table2 className="h-4 w-4 mr-2" />
          Convert to JSON
        </Button>
      </div>
    </div>
  );
}
