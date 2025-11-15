import { NextRequest, NextResponse } from 'next/server';

interface UrlRequestBody {
  text?: string;
  mode?: 'encode' | 'decode' | 'auto';
}

function safeDecode(value: string) {
  try {
    const decoded = decodeURIComponent(value);
    // If decoding changes the value, assume it was encoded
    if (decoded !== value) {
      return { success: true, result: decoded };
    }

    // Check for percent-encoded sequences to decide whether it was encoded
    if (/%[0-9A-Fa-f]{2}/.test(value)) {
      return { success: true, result: decoded };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UrlRequestBody;

    if (!body.text?.length) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const mode = body.mode ?? 'auto';
    let operation: 'encode' | 'decode';
    let result: string;

    if (mode === 'encode') {
      operation = 'encode';
      result = encodeURIComponent(body.text);
    } else if (mode === 'decode') {
      operation = 'decode';
      result = decodeURIComponent(body.text);
    } else {
      const attempt = safeDecode(body.text);
      if (attempt.success) {
        operation = 'decode';
        result = attempt.result;
      } else {
        operation = 'encode';
        result = encodeURIComponent(body.text);
      }
    }

    return NextResponse.json({
      success: true,
      operation,
      result,
      original: body.text,
    });
  } catch (error) {
    console.error('URL encode/decode error:', error);
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    );
  }
}


