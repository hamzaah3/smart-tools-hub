import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'whatsapp';

interface QrRequestBody {
  type?: QRType;
  payload?: any;
  // Backwards compatibility
  text?: string;
}

function buildQrContent(body: QrRequestBody): { ok: true; content: string } | { ok: false; message: string } {
  const type = body.type ?? 'text';

  // Legacy support: simple text-only QR
  if (!body.type && body.text) {
    return { ok: true, content: String(body.text) };
  }

  const payload = body.payload ?? {};

  switch (type) {
    case 'url': {
      const rawUrl = (payload.url ?? '').trim();
      if (!rawUrl) return { ok: false, message: 'URL is required for URL QR' };
      const hasScheme = /^https?:\/\//i.test(rawUrl);
      const url = hasScheme ? rawUrl : `https://${rawUrl}`;
      return { ok: true, content: url };
    }

    case 'text': {
      const text = (payload.text ?? '').trim();
      if (!text) return { ok: false, message: 'Text is required for text QR' };
      return { ok: true, content: text };
    }

    case 'wifi': {
      const ssid = (payload.ssid ?? '').trim();
      const password = (payload.password ?? '').trim();
      const encryption = (payload.encryption ?? 'WPA').toUpperCase() as 'WPA' | 'WPA2' | 'NONE';

      if (!ssid) return { ok: false, message: 'SSID is required for WiFi QR' };

      const t = encryption === 'NONE' ? 'nopass' : 'WPA';
      const p = encryption === 'NONE' ? '' : `P:${password};`;

      const wifiString = `WIFI:T:${t};S:${ssid};${p}H:false;`;
      return { ok: true, content: wifiString };
    }

    case 'email': {
      const email = (payload.email ?? '').trim();
      const subject = (payload.subject ?? '').trim();
      const message = (payload.message ?? '').trim();

      if (!email) return { ok: false, message: 'Email is required for Email QR' };

      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (message) params.set('body', message);

      const query = params.toString();
      const mailto = query ? `mailto:${email}?${query}` : `mailto:${email}`;
      return { ok: true, content: mailto };
    }

    case 'phone': {
      const number = (payload.number ?? '').trim();
      if (!number) return { ok: false, message: 'Phone number is required for Phone QR' };
      return { ok: true, content: `tel:${number}` };
    }

    case 'sms': {
      const number = (payload.number ?? '').trim();
      const message = (payload.message ?? '').trim();
      if (!number) return { ok: false, message: 'Phone number is required for SMS QR' };
      // SMSTO is widely supported
      const sms = `SMSTO:${number}:${message}`;
      return { ok: true, content: sms };
    }

    case 'whatsapp': {
      const number = (payload.number ?? '').trim();
      const message = (payload.message ?? '').trim();
      if (!number) return { ok: false, message: 'Phone number is required for WhatsApp QR' };
      const base = `https://wa.me/${number.replace(/[^\d]/g, '')}`;
      const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
      return { ok: true, content: url };
    }

    default:
      return { ok: false, message: 'Unsupported QR type' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QrRequestBody;

    const result = buildQrContent(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const qrBuffer = await QRCode.toBuffer(result.content, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
    });

    return new NextResponse(Buffer.from(qrBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="qrcode.png"',
      },
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
