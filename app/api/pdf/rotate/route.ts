import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('files') as File | null;
    const rotationValue = formData.get('rotation') ?? formData.get('angle');
    const directionValue = formData.get('direction');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      return NextResponse.json(
        { error: 'PDF contains no pages' },
        { status: 400 }
      );
    }

    // Determine rotation angle
    let angle = 90;

    if (rotationValue) {
      const parsed = Number(rotationValue);
      if (!Number.isNaN(parsed) && parsed % 90 === 0) {
        angle = ((parsed % 360) + 360) % 360;
      }
    } else if (directionValue === 'counterclockwise') {
      angle = 270;
    }

    // Apply rotation to all pages
    pdfDoc.getPages().forEach((page) => {
      const currentRotation = page.getRotation().angle ?? 0;
      const newRotation = (currentRotation + angle) % 360;
      page.setRotation(degrees(newRotation));
    });

    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="rotated.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF rotate error:', error);
    return NextResponse.json(
      { error: 'Failed to rotate PDF' },
      { status: 500 }
    );
  }
}

