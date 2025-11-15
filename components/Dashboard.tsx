'use client';

import { useState } from 'react';
import { PDFTools } from './tools/PDFTools';
import { ImageTools } from './tools/ImageTools';
import { CSVTools } from './tools/CSVTools';
import { TextTools } from './tools/TextTools';
import { UtilityTools } from './tools/UtilityTools';

type ToolCategory = 'pdf' | 'image' | 'csv' | 'text' | 'utility' | null;
type CategoryId = Exclude<ToolCategory, null>;

const toolCatalog: Array<{
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  badge: string;
  accent: string;
  tools: Array<{ id: string; title: string; blurb: string }>;
}> = [
  {
    id: 'pdf',
    name: 'PDF studio',
    badge: 'Documents',
    icon: '📄',
    accent: 'text-sky-600',
    description: 'Merge, split, compress, rotate, or convert PDFs to clean images in seconds.',
    tools: [
      { id: 'merge', title: 'Merge PDFs', blurb: 'Combine multiple files into one.' },
      { id: 'split', title: 'Split PDF', blurb: 'Extract specific pages or ranges.' },
      { id: 'compress', title: 'Compress PDF', blurb: 'Shrink file size without losing quality.' },
      { id: 'rotate', title: 'Rotate pages', blurb: 'Fix upside-down or sideways documents.' },
      { id: 'pdf-to-image', title: 'PDF → Images', blurb: 'Download every page as PNG or JPG.' },
    ],
  },
  {
    id: 'image',
    name: 'Image lab',
    badge: 'Media',
    icon: '🖼️',
    accent: 'text-amber-600',
    description: 'Convert, resize, compress, or encode images with precise controls.',
    tools: [
      { id: 'convert', title: 'Format converter', blurb: 'Switch between PNG, JPG, WEBP, AVIF.' },
      { id: 'resize', title: 'Resize images', blurb: 'Edit width and height in pixels.' },
      { id: 'compress', title: 'Compress images', blurb: 'Balance clarity and filesize.' },
      { id: 'base64', title: 'Base64', blurb: 'Turn any image into Base64 text.' },
    ],
  },
  {
    id: 'csv',
    name: 'CSV workshop',
    badge: 'Data',
    icon: '📊',
    accent: 'text-emerald-600',
    description: 'Preview, clean, merge, and convert CSV data for quick sharing.',
    tools: [
      { id: 'preview', title: 'Preview CSV', blurb: 'Open any CSV and inspect the first rows.' },
      { id: 'to-json', title: 'CSV → JSON', blurb: 'Generate tidy JSON payloads.' },
      { id: 'clean', title: 'Clean data', blurb: 'Remove blank rows and stray columns.' },
      { id: 'merge', title: 'Merge CSVs', blurb: 'Stack multiple CSV files instantly.' },
    ],
  },
  {
    id: 'text',
    name: 'Text desk',
    badge: 'Writing',
    icon: '📝',
    accent: 'text-fuchsia-600',
    description: 'Count words, format JSON, convert case styles, or build QR codes.',
    tools: [
      { id: 'word-count', title: 'Word counter', blurb: 'Words, characters, pace, and more.' },
      { id: 'case', title: 'Case converter', blurb: 'Upper, lower, sentence, and title case.' },
      { id: 'json', title: 'JSON formatter', blurb: 'Validate and pretty-print JSON text.' },
      { id: 'qr', title: 'QR code maker', blurb: 'Create a downloadable QR in one click.' },
    ],
  },
  {
    id: 'utility',
    name: 'Utility drawer',
    badge: 'Everyday',
    icon: '🧰',
    accent: 'text-violet-600',
    description: 'Generate passwords, convert colors, encode URLs, or switch units.',
    tools: [
      { id: 'password', title: 'Password generator', blurb: 'Create and copy secure strings.' },
      { id: 'url', title: 'URL encode/decode', blurb: 'Clean up URLs before sharing.' },
      { id: 'color', title: 'Color converter', blurb: 'HEX, RGB, and HSL in sync.' },
      { id: 'unit', title: 'Unit converter', blurb: 'Convert between common measures.' },
    ],
  },
];

export function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(null);

  return (
    <section id="tools" className="bg-slate-50 py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Toolbox</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-900">All tools at a glance</h2>
          <p className="mt-4 text-lg text-slate-600">
            Scroll once to explore every converter, cleaner, and optimizer. Tap any tile to launch the
            focus view for that toolkit.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {toolCatalog.map((category) => (
            <div key={category.id} id={category.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-base font-semibold uppercase tracking-wide text-slate-500">
                    <span>{category.badge}</span>
                    <span className="text-slate-300">•</span>
                    <span className={category.accent}>{category.icon} {category.name}</span>
                  </div>
                  <p className="mt-2 text-lg text-slate-600">{category.description}</p>
                </div>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className="self-start rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                >
                  Open {category.name}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="group h-full rounded-2xl border border-slate-100 bg-slate-50/40 p-5 text-left transition hover:-translate-y-1 hover:border-slate-200 hover:bg-white"
                  >
                    <div className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                      {category.icon} {category.badge}
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{tool.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{tool.blurb}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-600">
                      Launch tool
                      <svg
                        className="ml-2 h-4 w-4 transition group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-8 text-center shadow-sm md:p-12">
            <h3 className="text-2xl font-bold text-emerald-800">Your files stay yours</h3>
            <p className="mt-3 text-lg text-emerald-700">
              Conversions run in secure containers. We delete your uploads immediately after processing.
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              No accounts, no tracking, just fast results.
            </p>
          </div>
        </div>
      </div>

      {activeCategory === 'pdf' && <PDFTools onClose={() => setActiveCategory(null)} />}
      {activeCategory === 'image' && <ImageTools onClose={() => setActiveCategory(null)} />}
      {activeCategory === 'csv' && <CSVTools onClose={() => setActiveCategory(null)} />}
      {activeCategory === 'text' && <TextTools onClose={() => setActiveCategory(null)} />}
      {activeCategory === 'utility' && <UtilityTools onClose={() => setActiveCategory(null)} />}
    </section>
  );
}
