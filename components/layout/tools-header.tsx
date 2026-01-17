'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TOOLS } from '@/lib/tools-registry';

export function ToolsHeader() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  
  // Find current tool based on pathname
  const currentTool = TOOLS.find(tool => tool.href === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left Side - Navigation */}
        <div className="flex items-center gap-1">
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium">
              Tools
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium">
              Blog
            </Button>
          </Link>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ml-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="border-2">
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                ☀️ Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                🌙 Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                💻 System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center/Right - Current Tool Name */}
        {currentTool && (
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {currentTool.name}
          </h1>
        )}
      </div>
    </header>
  );
}
