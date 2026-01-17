'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function QrGeneratorPage() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');

  const generateQR = async () => {
    if (!text) {
      toast.error('Please enter text or URL');
      return;
    }

    try {
      // Using a QR code API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      setQrCode(qrUrl);
      toast.success('QR Code generated!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    link.click();
    toast.success('QR Code downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-text">Enter Text or URL</Label>
              <Input
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text..."
                className="text-base"
              />
            </div>

            <Button onClick={generateQR} className="w-full" size="lg">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrCode && (
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="mx-auto border-2 rounded-lg shadow-lg"
                />
                <Button onClick={downloadQR} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
