'use client';

import { type ReactNode, useState } from 'react';
import { FileText, Image as ImageIcon, QrCode, Table2, Type, Wrench, ArrowRight } from 'lucide-react';
import { PDFTools } from './tools/PDFTools';
import { ImageTools } from './tools/ImageTools';
import { CSVTools } from './tools/CSVTools';
import { TextTools } from './tools/TextTools';
import { UtilityTools } from './tools/UtilityTools';
import { QrTools } from './tools/QrTools';
import { Pill } from './Pill';

type ToolCategory = 'pdf' | 'image' | 'csv' | 'text' | 'utility' | 'qr' | null;
type CategoryId = Exclude<ToolCategory, null>;

const pillStyles: Record<CategoryId, { solid: string; outline: string }> = {
  pdf: {
    solid: 'bg-sky-600 border-sky-500 text-sky-50',
    outline: 'border-sky-500 text-sky-100',
  },
  image: {
    solid: 'bg-amber-600 border-amber-500 text-amber-50',
    outline: 'border-amber-500 text-amber-100',
  },
  csv: {
    solid: 'bg-emerald-600 border-emerald-500 text-emerald-50',
    outline: 'border-emerald-500 text-emerald-100',
  },
  text: {
    solid: 'bg-fuchsia-600 border-fuchsia-500 text-fuchsia-50',
    outline: 'border-fuchsia-500 text-fuchsia-100',
  },
  utility: {
    solid: 'bg-violet-600 border-violet-500 text-violet-50',
    outline: 'border-violet-500 text-violet-100',
  },
  qr: {
    solid: 'bg-sky-700 border-sky-500 text-sky-50',
    outline: 'border-sky-400 text-sky-100',
  },
};

const toolCatalog: Array<{
  id: CategoryId;
  name: string;
  description: string;
  icon: ReactNode;
  badge: string;
  accent: string;
  tools: Array<{ id: string; title: string; blurb: string }>;
}> = [
  {
    id: 'pdf',
    name: 'PDF studio',
    badge: 'Documents',
    icon: <FileText className="h-4 w-4" />,
    accent: 'text-sky-400',
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
    icon: <ImageIcon className="h-4 w-4" />,
    accent: 'text-amber-400',
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
    icon: <Table2 className="h-4 w-4" />,
    accent: 'text-emerald-400',
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
    icon: <Type className="h-4 w-4" />,
    accent: 'text-fuchsia-400',
    description: 'Count words, format JSON, and convert case styles.',
    tools: [
      { id: 'word-count', title: 'Word counter', blurb: 'Words, characters, pace, and more.' },
      { id: 'case', title: 'Case converter', blurb: 'Upper, lower, sentence, and title case.' },
      { id: 'json', title: 'JSON formatter', blurb: 'Validate and pretty-print JSON text.' },
    ],
  },
  {
    id: 'qr',
    name: 'QR studio',
    badge: 'Codes',
    icon: <QrCode className="h-4 w-4" />,
    accent: 'text-sky-400',
    description: 'Create QR codes for links, WiFi, contact actions, and messages.',
    tools: [
      { id: 'qr-studio', title: 'QR generator', blurb: 'URL, text, WiFi, email, phone, SMS, WhatsApp.' },
    ],
  },
  {
    id: 'utility',
    name: 'Utility drawer',
    badge: 'Everyday',
    icon: <Wrench className="h-4 w-4" />,
    accent: 'text-violet-400',
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
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

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
            <div
              key={category.id}
              id={category.id}
              className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 p-6 shadow-lg shadow-slate-900/40 md:p-10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Pill
                      label={category.badge}
                      icon={category.icon}
                      variant="solid"
                      className={`uppercase tracking-[0.2em] text-[0.7rem] ${pillStyles[category.id].solid}`}
                    />
                    <Pill
                      label={category.name}
                      variant="outline"
                      className={`uppercase tracking-[0.2em] text-[0.7rem] ${pillStyles[category.id].outline}`}
                    />
                  </div>
                  <p className="text-lg text-slate-100">{category.description}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveToolId(null);
                  }}
                  className="self-start rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-50 hover:border-slate-500 hover:bg-slate-900/80"
                >
                  Open {category.name}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setActiveToolId(tool.id);
                    }}
                    className="group h-full rounded-2xl border border-slate-800 bg-black p-5 text-left transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900"
                  >
                    <p className="text-lg font-semibold text-slate-50">{tool.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{tool.blurb}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-400">
                      Launch tool
                      <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 p-8 text-center shadow-lg shadow-slate-900/40 md:p-12">
            <h3 className="text-2xl font-bold text-emerald-200">Your files stay yours</h3>
            <p className="mt-3 text-lg text-emerald-100">
              Conversions run in secure containers. We delete your uploads immediately after processing.
            </p>
            <p className="mt-1 text-sm text-emerald-300/80">
              No accounts, no tracking, just fast results.
            </p>
          </div>
        </div>
      </div>

      {activeCategory === 'pdf' && (
        <PDFTools
          onClose={() => {
            setActiveCategory(null);
            setActiveToolId(null);
          }}
          initialToolId={activeToolId as any}
        />
      )}
      {activeCategory === 'image' && (
        <ImageTools
          onClose={() => {
            setActiveCategory(null);
            setActiveToolId(null);
          }}
          initialToolId={activeToolId as any}
        />
      )}
      {activeCategory === 'csv' && (
        <CSVTools
          onClose={() => {
            setActiveCategory(null);
            setActiveToolId(null);
          }}
          initialToolId={activeToolId as any}
        />
      )}
      {activeCategory === 'text' && (
        <TextTools
          onClose={() => {
            setActiveCategory(null);
            setActiveToolId(null);
          }}
          initialToolId={activeToolId as any}
        />
      )}
      {activeCategory === 'utility' && (
        <UtilityTools
          onClose={() => {
            setActiveCategory(null);
            setActiveToolId(null);
          }}
          initialToolId={activeToolId as any}
        />
      )}
    </section>
  );
}
