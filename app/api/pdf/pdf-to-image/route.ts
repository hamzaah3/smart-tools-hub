import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import sharp from 'sharp';
import path from 'path';

async function convertPageToImage(
  pdfBuffer: ArrayBuffer,
  pageIndex: number,
  format: 'png' | 'jpeg',
  density: number,
  quality?: number
) {
  const sharpInstance = sharp(Buffer.from(pdfBuffer), {
    density,
    page: pageIndex,
    pages: 1,
    limitInputPixels: false,
  });

  if (format === 'png') {
    return sharpInstance.png().toBuffer();
  }

  return sharpInstance.jpeg({
    quality: quality ?? 85,
    mozjpeg: true,
  }).toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('files') as File | null;
    const optionsStr = formData.get('options') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const options = optionsStr ? JSON.parse(optionsStr) : {};
    const format = options.format === 'jpeg' || options.format === 'jpg' ? 'jpeg' : 'png';
    const density = typeof options.density === 'number' && options.density > 0 ? options.density : 150;
    const quality = typeof options.quality === 'number' ? options.quality : undefined;

    const pdfBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      return NextResponse.json(
        { error: 'PDF contains no pages' },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const baseName = path.parse(file.name).name || 'document';

    for (let i = 0; i < pageCount; i++) {
      const imageBuffer = await convertPageToImage(pdfBuffer, i, format, density, quality);
      zip.file(`${baseName}-page-${i + 1}.${format === 'jpeg' ? 'jpg' : 'png'}`, imageBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(Buffer.from(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${baseName}-images.zip"`,
      },
    });
  } catch (error) {
    console.error('PDF to image error:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF to images' },
      { status: 500 }
    );
  }
}

