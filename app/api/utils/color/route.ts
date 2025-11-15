import { NextRequest, NextResponse } from 'next/server';

interface ColorRequestBody {
  value?: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function clamp(value: number, min = 0, max = 255) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace('#', '');

  if (![3, 6].includes(normalized.length)) {
    return null;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const intVal = parseInt(expanded, 16);

  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b]
    .map((value) => clamp(Math.round(value)).toString(16).padStart(2, '0'))
    .join('')}`;
}

function rgbToHsl({ r, g, b }: RGB) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      default:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function parseRgb(value: string): RGB | null {
  const match = value
    .replace(/\s+/g, '')
    .match(/^rgb(a)?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,[\d.]+)?\)$/i);

  if (!match) {
    return null;
  }

  const r = clamp(parseInt(match[2], 10));
  const g = clamp(parseInt(match[3], 10));
  const b = clamp(parseInt(match[4], 10));

  return { r, g, b };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ColorRequestBody;

    if (!body.value?.trim()) {
      return NextResponse.json(
        { error: 'Color value is required' },
        { status: 400 }
      );
    }

    const value = body.value.trim();
    let rgb: RGB | null = null;
    let inputFormat: 'hex' | 'rgb';

    if (value.startsWith('#')) {
      inputFormat = 'hex';
      rgb = hexToRgb(value);
    } else {
      inputFormat = 'rgb';
      rgb = parseRgb(value);
    }

    if (!rgb) {
      return NextResponse.json(
        { error: 'Invalid color format. Use HEX (#FF5733) or RGB (rgb(255, 87, 51)).' },
        { status: 400 }
      );
    }

    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);

    return NextResponse.json({
      success: true,
      inputFormat,
      conversions: {
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      },
    });
  } catch (error) {
    console.error('Color conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert color' },
      { status: 500 }
    );
  }
}


