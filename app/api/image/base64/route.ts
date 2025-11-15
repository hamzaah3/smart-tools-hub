import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const file = files[0];
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      base64: dataUrl,
      size: base64.length,
      mimeType,
    });
  } catch (error) {
    console.error('Base64 conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert to base64' },
      { status: 500 }
    );
  }
}
