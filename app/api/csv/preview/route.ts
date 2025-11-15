import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();

    // Parse CSV with papaparse
    const result = Papa.parse(text, {
      header: false,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing failed', details: result.errors },
        { status: 400 }
      );
    }

    // Return first 10 rows for preview
    const preview = result.data.slice(0, 10);

    return NextResponse.json({
      preview,
      totalRows: result.data.length,
      columns: result.data[0] ? (result.data[0] as string[]).length : 0,
    });
  } catch (error) {
    console.error('CSV preview error:', error);
    return NextResponse.json(
      { error: 'Failed to preview CSV' },
      { status: 500 }
    );
  }
}
