/**
 * Centralized Tool Registry
 * Add new tools here to automatically integrate them into the platform
 */

import { 
  GitCompareArrows, 
  Braces, 
  Lock, 
  QrCode, 
  FileText, 
  Image, 
  Table2,
  Type,
  Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: ToolCategory;
  tags: string[];
  featured?: boolean;
  new?: boolean;
  comingSoon?: boolean;
}

export type ToolCategory = 
  | 'Text' 
  | 'Code' 
  | 'Image' 
  | 'PDF' 
  | 'Data' 
  | 'Utility';

export const TOOL_CATEGORIES: Record<ToolCategory, { name: string; description: string; color: string }> = {
  Text: {
    name: 'Text Tools',
    description: 'Compare, format, and manipulate text',
    color: 'blue',
  },
  Code: {
    name: 'Code Tools',
    description: 'Format, validate, and transform code',
    color: 'purple',
  },
  Image: {
    name: 'Image Tools',
    description: 'Convert, compress, and edit images',
    color: 'pink',
  },
  PDF: {
    name: 'PDF Tools',
    description: 'Merge, split, and convert PDFs',
    color: 'red',
  },
  Data: {
    name: 'Data Tools',
    description: 'Transform and analyze data',
    color: 'green',
  },
  Utility: {
    name: 'Utilities',
    description: 'Encoding, hashing, and more',
    color: 'gray',
  },
};

export const TOOLS: Tool[] = [
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare text side-by-side with GitHub-style diff highlighting',
    icon: GitCompareArrows,
    href: '/tools/diff-checker',
    category: 'Text',
    tags: ['diff', 'compare', 'text', 'side-by-side', 'git'],
    featured: true,
    new: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: Braces,
    href: '/tools/json-formatter',
    category: 'Code',
    tags: ['json', 'format', 'validate', 'beautify'],
    featured: true,
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: Lock,
    href: '/tools/base64',
    category: 'Utility',
    tags: ['base64', 'encode', 'decode', 'binary'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, WiFi, and more',
    icon: QrCode,
    href: '/tools/qr-generator',
    category: 'Utility',
    tags: ['qr', 'qrcode', 'generator', 'url', 'wifi'],
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into one',
    icon: FileText,
    href: '/tools/pdf-merger',
    category: 'PDF',
    tags: ['pdf', 'merge', 'combine'],
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images between formats (JPG, PNG, WEBP, AVIF)',
    icon: Image,
    href: '/tools/image-converter',
    category: 'Image',
    tags: ['image', 'convert', 'format', 'jpg', 'png'],
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON format',
    icon: Table2,
    href: '/tools/csv-to-json',
    category: 'Data',
    tags: ['csv', 'json', 'convert', 'data'],
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text between different cases',
    icon: Type,
    href: '/tools/text-case-converter',
    category: 'Text',
    tags: ['text', 'case', 'uppercase', 'lowercase'],
  },
];

// Helper functions
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return TOOLS.filter(tool => tool.category === category);
};

export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter(tool => tool.featured);
};

export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase();
  return TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.includes(lowerQuery))
  );
};

export const getToolCategories = (): ToolCategory[] => {
  return Object.keys(TOOL_CATEGORIES) as ToolCategory[];
};
