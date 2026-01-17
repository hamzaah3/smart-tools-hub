'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DiffResult } from '../lib/diff-engine';

interface DiffOutputProps {
  result: DiffResult;
  mode: 'split' | 'unified';
}

export function DiffOutput({ result, mode }: DiffOutputProps) {
  if (mode === 'unified') {
    return <UnifiedDiffView result={result} />;
  }

  return <SplitDiffView result={result} />;
}

function SplitDiffView({ result }: { result: DiffResult }) {
  const leftLines = result.lines.filter(l => l.type !== 'added');
  const rightLines = result.lines.filter(l => l.type !== 'removed');

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Left Panel - Original */}
      <Card className="overflow-hidden border-2 border-red-200 dark:border-red-900/50 shadow-lg bg-gradient-to-br from-red-50/50 via-slate-50 to-slate-50 dark:from-red-950/10 dark:via-slate-900 dark:to-slate-900">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 px-4 py-3 border-b-2 border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-bold text-red-900 dark:text-red-100">Original</span>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="font-mono text-sm">
              {leftLines.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex transition-colors",
                    line.type === 'removed' && "bg-red-100/80 dark:bg-red-950/30"
                  )}
                >
                  <div className="flex-shrink-0 w-14 px-3 py-1.5 text-right text-slate-500 dark:text-slate-400 select-none border-r-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold text-xs">
                    {line.lineNumber.old || ''}
                  </div>
                  <div className={cn(
                    "flex-1 px-4 py-1.5",
                    line.type === 'removed' && "bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500"
                  )}>
                    {line.type === 'removed' && (
                      <span className="text-red-700 dark:text-red-400 mr-2 font-bold">-</span>
                    )}
                    <span className={line.type === 'removed' ? 'text-red-900 dark:text-red-100' : 'text-slate-700 dark:text-slate-300'}>
                      {line.content || ' '}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel - Modified */}
      <Card className="overflow-hidden border-2 border-green-200 dark:border-green-900/50 shadow-lg bg-gradient-to-br from-green-50/50 via-slate-50 to-slate-50 dark:from-green-950/10 dark:via-slate-900 dark:to-slate-900">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 px-4 py-3 border-b-2 border-green-200 dark:border-green-900/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-bold text-green-900 dark:text-green-100">Modified</span>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="font-mono text-sm">
              {rightLines.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex transition-colors",
                    line.type === 'added' && "bg-green-100/80 dark:bg-green-950/30"
                  )}
                >
                  <div className="flex-shrink-0 w-14 px-3 py-1.5 text-right text-slate-500 dark:text-slate-400 select-none border-r-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold text-xs">
                    {line.lineNumber.new || ''}
                  </div>
                  <div className={cn(
                    "flex-1 px-4 py-1.5",
                    line.type === 'added' && "bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500"
                  )}>
                    {line.type === 'added' && (
                      <span className="text-green-700 dark:text-green-400 mr-2 font-bold">+</span>
                    )}
                    <span className={line.type === 'added' ? 'text-green-900 dark:text-green-100' : 'text-slate-700 dark:text-slate-300'}>
                      {line.content || ' '}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function UnifiedDiffView({ result }: { result: DiffResult }) {
  return (
    <Card className="overflow-hidden border-2 border-blue-200 dark:border-blue-900/50 shadow-lg bg-gradient-to-br from-blue-50/30 via-slate-50 to-slate-50 dark:from-blue-950/10 dark:via-slate-900 dark:to-slate-900">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/40 px-4 py-3 border-b-2 border-blue-200 dark:border-blue-900/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Unified Diff</span>
          </div>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="font-mono text-sm">
            {result.lines.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex transition-colors",
                  line.type === 'added' && "bg-green-100/80 dark:bg-green-950/30",
                  line.type === 'removed' && "bg-red-100/80 dark:bg-red-950/30"
                )}
              >
                <div className="flex-shrink-0 w-14 px-3 py-1.5 text-right text-slate-500 dark:text-slate-400 select-none border-r-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold text-xs">
                  {line.lineNumber.old || line.lineNumber.new || ''}
                </div>
                <div className={cn(
                  "flex-shrink-0 w-14 px-3 py-1.5 text-right text-slate-500 dark:text-slate-400 select-none border-r-2 border-slate-200 dark:border-slate-700 font-semibold text-xs",
                  line.type === 'added' && "bg-green-100 dark:bg-green-900/40",
                  line.type === 'removed' && "bg-red-100 dark:bg-red-900/40"
                )}>
                  {line.lineNumber.new || ''}
                </div>
                <div className={cn(
                  "flex-1 px-4 py-1.5",
                  line.type === 'added' && "bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500",
                  line.type === 'removed' && "bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500"
                )}>
                  {line.type === 'added' && (
                    <span className="text-green-700 dark:text-green-400 font-bold mr-2">+</span>
                  )}
                  {line.type === 'removed' && (
                    <span className="text-red-700 dark:text-red-400 font-bold mr-2">-</span>
                  )}
                  <span className={cn(
                    line.type === 'added' && 'text-green-900 dark:text-green-100',
                    line.type === 'removed' && 'text-red-900 dark:text-red-100',
                    line.type === 'unchanged' && 'text-slate-700 dark:text-slate-300'
                  )}>
                    {line.content || ' '}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
