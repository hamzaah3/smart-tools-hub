import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';

interface PasswordRequestBody {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

function buildCharacterPool(options: Required<Omit<PasswordRequestBody, 'length'>>) {
  let pool = '';

  if (options.includeUppercase) pool += UPPERCASE;
  if (options.includeLowercase) pool += LOWERCASE;
  if (options.includeNumbers) pool += NUMBERS;
  if (options.includeSymbols) pool += SYMBOLS;

  return pool;
}

function generatePassword(length: number, pool: string) {
  const characters = Array.from({ length }, () => pool[randomInt(pool.length)]);
  return characters.join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as PasswordRequestBody | undefined;

    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
    } = body ?? {};

    if (length < 8 || length > 64) {
      return NextResponse.json(
        { error: 'Length must be between 8 and 64 characters' },
        { status: 400 }
      );
    }

    const pool = buildCharacterPool({
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });

    if (!pool) {
      return NextResponse.json(
        { error: 'At least one character set must be enabled' },
        { status: 400 }
      );
    }

    const password = generatePassword(length, pool);

    return NextResponse.json({
      success: true,
      length,
      options: {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      },
      password,
    });
  } catch (error) {
    console.error('Password generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate password' },
      { status: 500 }
    );
  }
}


