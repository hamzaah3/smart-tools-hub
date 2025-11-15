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
    const { width, height } = options;
    const buffer = await file.arrayBuffer();

    let sharpInstance = sharp(Buffer.from(buffer));

    // Resize image
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        fit: 'inside',
      });
    }

    const outputBuffer = await sharpInstance.toBuffer();

    // Get original format
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    const format = metadata.format || 'png';

    return new NextResponse(Buffer.from(outputBuffer), {
      headers: {
        'Content-Type': `image/${format}`,
        'Content-Disposition': `attachment; filename="resized.${format}"`,
      },
    });
  } catch (error) {
    console.error('Image resize error:', error);
    return NextResponse.json(
      { error: 'Failed to resize image' },
      { status: 500 }
    );
  }
}
