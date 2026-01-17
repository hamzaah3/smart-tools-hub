/**
 * Diff Engine - Core logic for text comparison
 * Uses industry-standard diff algorithm (Myers' diff)
 */

import * as Diff from 'diff';

export interface DiffLine {
  content: string;
  type: 'added' | 'removed' | 'unchanged';
  lineNumber: {
    old: number | null;
    new: number | null;
  };
}

export interface DiffStats {
  linesAdded: number;
  linesRemoved: number;
  linesUnchanged: number;
  totalChanges: number;
}

export interface DiffResult {
  lines: DiffLine[];
  stats: DiffStats;
}

/**
 * Compute diff between two texts
 */
export function computeDiff(originalText: string, modifiedText: string): DiffResult {
  const changes = Diff.diffLines(originalText, modifiedText);
  
  const lines: DiffLine[] = [];
  let oldLineNumber = 1;
  let newLineNumber = 1;
  
  let linesAdded = 0;
  let linesRemoved = 0;
  let linesUnchanged = 0;

  for (const change of changes) {
    const content = change.value;
    const lineCount = content.split('\n').length - 1 || 1;

    if (change.added) {
      // Added lines (green)
      const contentLines = content.split('\n').filter(l => l !== '');
      contentLines.forEach(line => {
        lines.push({
          content: line,
          type: 'added',
          lineNumber: {
            old: null,
            new: newLineNumber++,
          },
        });
        linesAdded++;
      });
    } else if (change.removed) {
      // Removed lines (red)
      const contentLines = content.split('\n').filter(l => l !== '');
      contentLines.forEach(line => {
        lines.push({
          content: line,
          type: 'removed',
          lineNumber: {
            old: oldLineNumber++,
            new: null,
          },
        });
        linesRemoved++;
      });
    } else {
      // Unchanged lines
      const contentLines = content.split('\n').filter(l => l !== '');
      contentLines.forEach(line => {
        lines.push({
          content: line,
          type: 'unchanged',
          lineNumber: {
            old: oldLineNumber++,
            new: newLineNumber++,
          },
        });
        linesUnchanged++;
      });
    }
  }

  const stats: DiffStats = {
    linesAdded,
    linesRemoved,
    linesUnchanged,
    totalChanges: linesAdded + linesRemoved,
  };

  return { lines, stats };
}

/**
 * Compute character-level diff for inline highlighting
 * (For future enhancement)
 */
export function computeCharDiff(oldStr: string, newStr: string) {
  return Diff.diffChars(oldStr, newStr);
}

/**
 * Compute word-level diff
 * (For future enhancement)
 */
export function computeWordDiff(oldStr: string, newStr: string) {
  return Diff.diffWords(oldStr, newStr);
}

/**
 * Format diff for export
 */
export function formatDiffForExport(result: DiffResult): string {
  let output = '';
  
  output += `=== Diff Statistics ===\n`;
  output += `Added: ${result.stats.linesAdded} lines\n`;
  output += `Removed: ${result.stats.linesRemoved} lines\n`;
  output += `Unchanged: ${result.stats.linesUnchanged} lines\n`;
  output += `Total Changes: ${result.stats.totalChanges} lines\n\n`;
  
  output += `=== Diff Content ===\n`;
  
  result.lines.forEach(line => {
    const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
    output += `${prefix}${line.content}\n`;
  });
  
  return output;
}
