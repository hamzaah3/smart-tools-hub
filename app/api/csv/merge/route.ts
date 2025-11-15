import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

type ParsedCsv = {
  data: (string | number | null)[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
};

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

    const parsedFiles: ParsedCsv[] = [];
    let headers: string[] | null = null;

    for (const file of files) {
      const text = await file.text();
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parsed.errors.length > 0) {
        return NextResponse.json(
          {
            error: `Failed to parse file: ${file.name}`,
            details: parsed.errors,
          },
          { status: 400 }
        );
      }

      const currentHeaders = parsed.meta.fields ?? [];

      if (!headers) {
        headers = currentHeaders;
      } else if (currentHeaders.length !== headers.length || !currentHeaders.every((h, idx) => h === headers![idx])) {
        return NextResponse.json(
          { error: `Header mismatch detected in file: ${file.name}` },
          { status: 400 }
        );
      }

      parsedFiles.push(parsed as ParsedCsv);
    }

    if (!headers) {
      return NextResponse.json(
        { error: 'Unable to determine CSV headers' },
        { status: 400 }
      );
    }

    const combinedRows = parsedFiles.flatMap((parsed) => parsed.data);

    const mergedCsv = Papa.unparse({
      fields: headers,
      data: combinedRows,
    });

    return new NextResponse(mergedCsv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="merged.csv"',
      },
    });
  } catch (error) {
    console.error('CSV merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge CSV files' },
      { status: 500 }
    );
  }
}

