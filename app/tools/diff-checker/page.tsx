'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { InputPanel } from './components/input-panel';
import { DiffOutput } from './components/diff-output';
import { DiffStats } from './components/diff-stats';
import { computeDiff } from './lib/diff-engine';
import { GitCompareArrows, Download, RotateCcw, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { DiffResult } from './lib/diff-engine';

export default function DiffCheckerPage() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const handleCompare = useCallback(async () => {
    if (!originalText.trim() && !modifiedText.trim()) {
      toast.error('Please enter text in at least one panel');
      return;
    }

    setIsComparing(true);
    
    try {
      // Simulate processing for UX (diff is instant but feels more professional with brief delay)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = computeDiff(originalText, modifiedText);
      setDiffResult(result);
      toast.success('Comparison complete!');
    } catch (error) {
      toast.error('Failed to compare texts');
      console.error(error);
    } finally {
      setIsComparing(false);
    }
  }, [originalText, modifiedText]);

  const handleReset = () => {
    setOriginalText('');
    setModifiedText('');
    setDiffResult(null);
    toast.info('Inputs cleared');
  };

  const handleExport = () => {
    if (!diffResult) {
      toast.error('No comparison to export');
      return;
    }

    const exportData = {
      original: originalText,
      modified: modifiedText,
      stats: diffResult.stats,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diff-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Comparison exported!');
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons - Top Right */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!originalText && !modifiedText}
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/50 transition-all"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!diffResult}
          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 dark:hover:border-blue-900/50 transition-all"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      {diffResult && <DiffStats stats={diffResult.stats} />}

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'split' | 'unified')} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="unified">Unified View</TabsTrigger>
          </TabsList>

          <Button
            onClick={handleCompare}
            disabled={isComparing || (!originalText && !modifiedText)}
            size="lg"
          >
            <GitCompareArrows className="h-4 w-4 mr-2" />
            {isComparing ? 'Comparing...' : 'Check Difference'}
          </Button>
        </div>

        <TabsContent value="split" className="mt-0 space-y-4">
          {/* Input Panels */}
          {!diffResult ? (
            <div className="grid md:grid-cols-2 gap-4">
              <InputPanel
                label="Original"
                value={originalText}
                onChange={setOriginalText}
                placeholder="Paste your original text here..."
              />
              <InputPanel
                label="Modified"
                value={modifiedText}
                onChange={setModifiedText}
                placeholder="Paste your modified text here..."
              />
            </div>
          ) : (
            <DiffOutput result={diffResult} mode="split" />
          )}
        </TabsContent>

        <TabsContent value="unified" className="mt-0">
          {!diffResult ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Click "Check Difference" to see the unified view
              </CardContent>
            </Card>
          ) : (
            <DiffOutput result={diffResult} mode="unified" />
          )}
        </TabsContent>
      </Tabs>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
          <CardDescription>
            Professional diff checking for developers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <div>
                <div className="font-medium">Line-by-line comparison</div>
                <div className="text-sm text-muted-foreground">Precise highlighting of changes</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <div>
                <div className="font-medium">Split & unified views</div>
                <div className="text-sm text-muted-foreground">Choose your preferred layout</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <div>
                <div className="font-medium">GitHub-style colors</div>
                <div className="text-sm text-muted-foreground">Familiar green/red highlighting</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">✓</Badge>
              <div>
                <div className="font-medium">Export results</div>
                <div className="text-sm text-muted-foreground">Save comparisons as JSON</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
