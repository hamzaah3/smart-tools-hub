'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '@/lib/tools-registry';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Home, Sparkles, ChevronRight, Layers } from 'lucide-react';

const categoryColors: Record<ToolCategory, { icon: string; text: string; bg: string; border: string; activeBg: string; activeText: string }> = {
  Text: {
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900/50',
    activeBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    activeText: 'text-white',
  },
  Code: {
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-900/50',
    activeBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
    activeText: 'text-white',
  },
  Image: {
    icon: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-900/50',
    activeBg: 'bg-gradient-to-r from-pink-500 to-pink-600',
    activeText: 'text-white',
  },
  PDF: {
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-900/50',
    activeBg: 'bg-gradient-to-r from-red-500 to-red-600',
    activeText: 'text-white',
  },
  Data: {
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900/50',
    activeBg: 'bg-gradient-to-r from-green-500 to-green-600',
    activeText: 'text-white',
  },
  Utility: {
    icon: 'text-slate-600 dark:text-slate-400',
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-950/20',
    border: 'border-slate-200 dark:border-slate-700',
    activeBg: 'bg-gradient-to-r from-slate-500 to-slate-600',
    activeText: 'text-white',
  },
};

export function ToolsSidebar() {
  const pathname = usePathname();
  
  // Group tools by category
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, typeof TOOLS>);

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-950 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <Link 
          href="/tools"
          className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Layers className="h-4 w-4" />
          </div>
          <span className="flex-1 text-base font-bold">All Tools</span>
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Tools List */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-6 pb-6">
          {Object.entries(toolsByCategory).map(([category, tools]) => {
            const colors = categoryColors[category as ToolCategory];
            
            return (
              <div key={category}>
                <div className={cn(
                  "mb-3 px-3 py-2 rounded-lg border-l-4",
                  colors.bg,
                  colors.border
                )}>
                  <h3 className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-2",
                    colors.text
                  )}>
                    <div className={cn("h-1.5 w-1.5 rounded-full", colors.icon.replace('text-', 'bg-'))}></div>
                    {TOOL_CATEGORIES[category as ToolCategory].name}
                  </h3>
                </div>
                
                <div className="space-y-1.5">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = pathname === tool.href;
                    
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border-2",
                          isActive
                            ? cn(
                                colors.activeBg,
                                colors.activeText,
                                "shadow-lg hover:shadow-xl border-transparent"
                              )
                            : cn(
                                "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent",
                                "hover:bg-white/70 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                              )
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                          isActive
                            ? "bg-white/20"
                            : cn(colors.bg, "border", colors.border)
                        )}>
                          <Icon className={cn(
                            "h-4 w-4",
                            isActive ? "text-white" : colors.icon
                          )} />
                        </div>
                        <span className="flex-1 truncate">{tool.name}</span>
                        
                        <div className="flex items-center gap-1">
                          {tool.new && (
                            <Badge className="bg-green-500 text-white text-[9px] px-1.5 py-0 border-0 shadow-sm">
                              NEW
                            </Badge>
                          )}
                          {tool.featured && (
                            <span className="text-amber-500">⭐</span>
                          )}
                          {!isActive && (
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
          >
            <Home className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
