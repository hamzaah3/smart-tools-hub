import { NextRequest, NextResponse } from 'next/server';

interface WordCountRequestBody {
  text?: string;
  includeReadTime?: boolean;
}

function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

function countSentences(text: string) {
  const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  return matches ? matches.length : 0;
}

function countParagraphs(text: string) {
  const matches = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return matches.length;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WordCountRequestBody;

    if (typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const text = body.text;
    const words = countWords(text);
    const characters = text.length;
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const readTimeMinutes = body.includeReadTime
      ? Math.max(1, Math.ceil(words / 200))
      : undefined;

    return NextResponse.json({
      success: true,
      metrics: {
        words,
        characters,
        sentences,
        paragraphs,
        averageWordsPerSentence: sentences ? words / sentences : words,
        averageWordsPerParagraph: paragraphs ? words / paragraphs : words,
        readTimeMinutes,
      },
    });
  } catch (error) {
    console.error('Word count analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}


