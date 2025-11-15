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

    const file = files[0];
    const { quality = 80 } = options;
    const buffer = await file.arrayBuffer();

    const metadata = await sharp(Buffer.from(buffer)).metadata();
    const format = metadata.format || 'jpeg';

    let sharpInstance = sharp(Buffer.from(buffer));

    // Compress based on format
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': `image/${format}`,
        'Content-Disposition': `attachment; filename="compressed.${format}"`,
      },
    });
  } catch (error) {
    console.error('Image compress error:', error);
    return NextResponse.json(
      { error: 'Failed to compress image' },
      { status: 500 }
    );
  }
}
