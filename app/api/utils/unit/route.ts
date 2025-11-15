import { NextRequest, NextResponse } from 'next/server';

type Unit = 'kg' | 'lb' | 'cm' | 'in';

interface UnitRequestBody {
  value?: number;
  from?: Unit;
  to?: Unit;
  precision?: number;
}

const CONVERSION_FACTORS: Record<Unit, Record<Unit, number>> = {
  kg: { kg: 1, lb: 2.20462, cm: 0, in: 0 },
  lb: { lb: 1, kg: 1 / 2.20462, cm: 0, in: 0 },
  cm: { cm: 1, in: 0.393701, kg: 0, lb: 0 },
  in: { in: 1, cm: 2.54, kg: 0, lb: 0 },
};

const SUPPORTED_CONVERSIONS: Array<{ from: Unit; to: Unit; label: string }> = [
  { from: 'kg', to: 'lb', label: 'Kilograms to Pounds' },
  { from: 'lb', to: 'kg', label: 'Pounds to Kilograms' },
  { from: 'cm', to: 'in', label: 'Centimeters to Inches' },
  { from: 'in', to: 'cm', label: 'Inches to Centimeters' },
];

function isSupportedConversion(from: Unit, to: Unit) {
  return SUPPORTED_CONVERSIONS.some(
    (conversion) => conversion.from === from && conversion.to === to
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UnitRequestBody;
    const value = typeof body.value === 'number' ? body.value : undefined;
    const from = body.from ?? 'kg';
    const to = body.to ?? 'lb';
    const precision = Number.isInteger(body.precision) ? body.precision! : 2;

    if (value === undefined || Number.isNaN(value)) {
      return NextResponse.json(
        { error: 'A numeric value is required for conversion' },
        { status: 400 }
      );
    }

    if (!isSupportedConversion(from, to)) {
      return NextResponse.json(
        {
          error: 'Unsupported conversion',
          supported: SUPPORTED_CONVERSIONS,
        },
        { status: 400 }
      );
    }

    const factor = CONVERSION_FACTORS[from]?.[to];

    if (!factor) {
      return NextResponse.json(
        { error: 'Conversion factor not found' },
        { status: 400 }
      );
    }

    const convertedValue = value * factor;
    const formatted = Number.isFinite(precision)
      ? convertedValue.toFixed(Math.max(0, Math.min(6, precision)))
      : convertedValue.toString();

    return NextResponse.json({
      success: true,
      from,
      to,
      originalValue: value,
      convertedValue: Number(formatted),
      formatted: `${value} ${from} = ${formatted} ${to}`,
      supportedConversions: SUPPORTED_CONVERSIONS,
    });
  } catch (error) {
    console.error('Unit conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert value' },
      { status: 500 }
    );
  }
}


