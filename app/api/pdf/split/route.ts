import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('files') as File;
    const startPage = parseInt(formData.get('startPage') as string) || 1;
    const endPage = parseInt(formData.get('endPage') as string) || -1;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Create new PDF with selected pages
    const newPdf = await PDFDocument.create();
    const lastPage = endPage === -1 ? totalPages : Math.min(endPage, totalPages);

    for (let i = startPage - 1; i < lastPage; i++) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
    }

    const pdfBytes = await newPdf.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="split.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF split error:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    );
  }
}
