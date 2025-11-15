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

    // Parse CSV
    const result = Papa.parse(text, {
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing failed', details: result.errors },
        { status: 400 }
      );
    }

    // Clean data: remove empty rows and trim values
    const cleanedData = result.data
      .filter((row: any) => {
        if (Array.isArray(row)) {
          return row.some((cell) => cell !== null && cell !== undefined && cell !== '');
        }
        return true;
      })
      .map((row: any) => {
        if (Array.isArray(row)) {
          return row.map((cell) => (typeof cell === 'string' ? cell.trim() : cell));
        }
        return row;
      });

    // Convert back to CSV
    const cleanedCsv = Papa.unparse(cleanedData);

    return new NextResponse(cleanedCsv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="cleaned.csv"',
      },
    });
  } catch (error) {
    console.error('CSV clean error:', error);
    return NextResponse.json(
      { error: 'Failed to clean CSV' },
      { status: 500 }
    );
  }
}
