# Implementation Guide - Developer Tools Platform

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
# Core dependencies
npm install lucide-react
npm install diff  # For diff engine
npm install sonner  # For toast notifications

# shadcn/ui setup
npx shadcn-ui@latest init

# Install required shadcn components
npx shadcn-ui@latest add button card tabs textarea separator badge
npx shadcn-ui@latest add scroll-area toast select dropdown-menu
```

### Step 2: Configure Tailwind (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add more shadcn colors...
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### Step 3: Add CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* Add all shadcn CSS variables */
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* Dark mode variables */
  }
}
```

---

## 🚀 Implementation Steps

### Phase 1: Create Core Files (Already Done)

✅ `/lib/tools-registry.ts` - Tool registry
✅ `/app/tools/layout.tsx` - Shared layout
✅ `/components/layout/tools-sidebar.tsx` - Sidebar
✅ `/components/layout/tools-header.tsx` - Header
✅ `/app/tools/diff-checker/` - Complete diff checker

### Phase 2: Create Tools Dashboard

Create `/app/tools/page.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-registry';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Developer Tools</h1>
        <p className="text-muted-foreground mt-2">
          Professional tools for developers. Fast, secure, and free.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.id} href={tool.href}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {tool.new && (
                      <Badge variant="secondary">NEW</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

### Phase 3: Update Root Layout

Update `/app/layout.tsx` to include theme provider:

```typescript
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Create `/components/theme-provider.tsx`:

```typescript
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Phase 4: Add More Tools (Example Template)

Create `/app/tools/json-formatter/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function JSONFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      toast.success('JSON formatted successfully!');
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">JSON Formatter</h1>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            className="min-h-[400px] font-mono"
          />
        </Card>
        
        <Card className="p-4">
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON..."
            className="min-h-[400px] font-mono"
          />
        </Card>
      </div>

      <Button onClick={handleFormat} size="lg">
        Format JSON
      </Button>
    </div>
  );
}
```

---

## 🔄 Migration from Modal System

### Step 1: Keep Both Systems Running

```typescript
// In your current Dashboard.tsx
export function Dashboard() {
  const [useNewSystem, setUseNewSystem] = useState(true);
  
  if (useNewSystem) {
    return <Link href="/tools/diff-checker">Open Diff Checker</Link>;
  }
  
  // Old modal system
  return <OldModalSystem />;
}
```

### Step 2: Migrate Tools One by One

1. Build new page-based tool
2. Test thoroughly
3. Add feature flag
4. A/B test if needed
5. Remove old modal version

### Step 3: Update All Links

Replace:
```typescript
// Old
onClick={() => openModal('diff-checker')}

// New
<Link href="/tools/diff-checker">Open Tool</Link>
```

---

## 🎨 Design System Guidelines

### Component Usage

```typescript
// Always use shadcn components
import { Button } from '@/components/ui/button';  // ✅ Good
import { MyButton } from '@/components/button';   // ❌ Bad

// Consistent styling
<Button variant="default" size="lg">Primary Action</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Color System

```typescript
// Use semantic colors
className="bg-primary text-primary-foreground"  // ✅ Good
className="bg-blue-600 text-white"              // ❌ Bad

// Diff-specific colors
className="bg-green-100 dark:bg-green-900/30"   // Added
className="bg-red-100 dark:bg-red-900/30"       // Removed
```

### Typography

```typescript
// Headings
<h1 className="text-4xl font-bold tracking-tight">
<h2 className="text-3xl font-semibold">
<h3 className="text-2xl font-medium">

// Body
<p className="text-base text-foreground">
<p className="text-sm text-muted-foreground">
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```typescript
// __tests__/diff-engine.test.ts
import { describe, it, expect } from 'vitest';
import { computeDiff } from '@/app/tools/diff-checker/lib/diff-engine';

describe('Diff Engine', () => {
  it('should detect added lines', () => {
    const result = computeDiff('hello', 'hello\nworld');
    expect(result.stats.linesAdded).toBe(1);
  });

  it('should detect removed lines', () => {
    const result = computeDiff('hello\nworld', 'hello');
    expect(result.stats.linesRemoved).toBe(1);
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/diff-checker.spec.ts
import { test, expect } from '@playwright/test';

test('diff checker workflow', async ({ page }) => {
  await page.goto('/tools/diff-checker');
  
  // Fill inputs
  await page.fill('[placeholder*="original"]', 'Hello World');
  await page.fill('[placeholder*="modified"]', 'Hello Universe');
  
  // Click compare
  await page.click('text=Check Difference');
  
  // Verify results
  await expect(page.locator('text=1 line changed')).toBeVisible();
});
```

---

## 📊 Performance Optimizations

### Code Splitting

```typescript
// Lazy load heavy components
const DiffOutput = lazy(() => import('./components/diff-output'));

// Lazy load diff library
const computeDiff = async (a, b) => {
  const { computeDiff: fn } = await import('./lib/diff-engine');
  return fn(a, b);
};
```

### Virtualization (for large diffs)

```typescript
import { VirtualList } from '@tanstack/react-virtual';

// For 10,000+ line diffs
<VirtualList
  items={diffLines}
  renderItem={(line) => <DiffLine line={line} />}
/>
```

---

## 🚀 Deployment Checklist

- [ ] All shadcn components installed
- [ ] Diff library (`diff`) installed
- [ ] Toast notifications (`sonner`) installed
- [ ] Theme provider configured
- [ ] Tools registry created
- [ ] Layout components built
- [ ] Diff checker implemented
- [ ] Tools dashboard page created
- [ ] Dark mode tested
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Performance tested
- [ ] SEO optimized
- [ ] Analytics added

---

## 📈 Adding a New Tool (5-Minute Checklist)

1. **Add to registry** (`lib/tools-registry.ts`):
   ```typescript
   {
     id: 'my-tool',
     name: 'My Tool',
     description: 'What it does',
     icon: MyIcon,
     href: '/tools/my-tool',
     category: 'Text',
     tags: ['tag1', 'tag2'],
   }
   ```

2. **Create page** (`app/tools/my-tool/page.tsx`):
   ```typescript
   export default function MyToolPage() {
     return <div>My Tool</div>;
   }
   ```

3. **Build components** (optional):
   - `components/input.tsx`
   - `components/output.tsx`

4. **Add logic** (if needed):
   - `lib/my-tool-engine.ts`

5. **Test & Deploy** ✅

---

**Your platform is now production-ready! 🎉**
