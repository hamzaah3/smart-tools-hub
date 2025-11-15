import { NextRequest, NextResponse } from 'next/server';

type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle';

interface CaseRequestBody {
  text?: string;
  mode?: CaseMode;
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => {
    const [first = '', ...rest] = word;
    return `${first.toUpperCase()}${rest.join('').toLowerCase()}`;
  });
}

function toSentenceCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^\s*[a-z]|[.!?]\s*[a-z])/g, (match) => match.toUpperCase());
}

function toToggleCase(value: string) {
  return value
    .split('')
    .map((char, index) =>
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    )
    .join('');
}

function transformText(text: string, mode: CaseMode) {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return toTitleCase(text);
    case 'sentence':
      return toSentenceCase(text);
    case 'toggle':
      return toToggleCase(text);
    default:
      return text;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CaseRequestBody;

    if (!body.text?.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const mode: CaseMode = body.mode ?? 'upper';
    const output = transformText(body.text, mode);

    return NextResponse.json({
      success: true,
      mode,
      originalLength: body.text.length,
      resultLength: output.length,
      result: output,
    });
  } catch (error) {
    console.error('Text case conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert text case' },
      { status: 500 }
    );
  }
}


