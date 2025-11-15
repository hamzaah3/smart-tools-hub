import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const optionsStr = formData.get('options') as string;
    const options = optionsStr ? JSON.parse(optionsStr) : {};

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const file = files[0]; // Process first file
    const { format = 'png', quality = 85 } = options;
    const buffer = await file.arrayBuffer();

    let sharpInstance = sharp(Buffer.from(buffer));

    // Convert to specified format
    if (format === 'jpg' || format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    } else if (format === 'avif') {
      sharpInstance = sharpInstance.avif({ quality });
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': `image/${format === 'jpg' ? 'jpeg' : format}`,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
}
