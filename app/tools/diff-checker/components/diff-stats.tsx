'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Equal } from 'lucide-react';
import type { DiffStats as DiffStatsType } from '../lib/diff-engine';

interface DiffStatsProps {
  stats: DiffStatsType;
}

export function DiffStats({ stats }: DiffStatsProps) {
  const totalLines = stats.linesAdded + stats.linesRemoved + stats.linesUnchanged;
  const changePercentage = totalLines > 0 
    ? ((stats.totalChanges / totalLines) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2 border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
              <Plus className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="text-3xl font-black text-green-900 dark:text-green-100">{stats.linesAdded}</div>
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">Lines Added</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
              <Minus className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="text-3xl font-black text-red-900 dark:text-red-100">{stats.linesRemoved}</div>
              <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">Lines Removed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 shadow-lg shadow-slate-500/30">
              <Equal className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{stats.linesUnchanged}</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Unchanged</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <span className="text-xl font-black text-white">{changePercentage}%</span>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-900 dark:text-blue-100">{stats.totalChanges}</div>
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Total Changes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
