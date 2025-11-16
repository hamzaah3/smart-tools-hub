'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'whatsapp';

interface QrToolsProps {
  onClose: () => void;
}

export function QrTools({ onClose }: QrToolsProps) {
  const [qrType, setQrType] = useState<QRType>('text');

  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [qrWifiSsid, setQrWifiSsid] = useState('');
  const [qrWifiPassword, setQrWifiPassword] = useState('');
  const [qrWifiEncryption, setQrWifiEncryption] = useState<'WPA' | 'WPA2' | 'NONE'>('WPA');
  const [qrEmail, setQrEmail] = useState('');
  const [qrEmailSubject, setQrEmailSubject] = useState('');
  const [qrEmailMessage, setQrEmailMessage] = useState('');
  const [qrPhone, setQrPhone] = useState('');
  const [qrSmsNumber, setQrSmsNumber] = useState('');
  const [qrSmsMessage, setQrSmsMessage] = useState('');
  const [qrWhatsAppNumber, setQrWhatsAppNumber] = useState('');
  const [qrWhatsAppMessage, setQrWhatsAppMessage] = useState('');

  const handleGenerate = async () => {
    try {
      let payload: any = {};

      switch (qrType) {
        case 'url': {
          if (!qrUrl.trim()) {
            toast.error('Enter a URL to encode');
            return;
          }
          payload = { url: qrUrl };
          break;
        }
        case 'text': {
          if (!text.trim()) {
            toast.error('Enter text to encode');
            return;
          }
          payload = { text };
          break;
        }
        case 'wifi': {
          if (!qrWifiSsid.trim()) {
            toast.error('Enter WiFi SSID');
            return;
          }
          if (qrWifiEncryption !== 'NONE' && !qrWifiPassword.trim()) {
            toast.error('Enter WiFi password');
            return;
          }
          payload = {
            ssid: qrWifiSsid,
            password: qrWifiPassword,
            encryption: qrWifiEncryption,
          };
          break;
        }
        case 'email': {
          if (!qrEmail.trim()) {
            toast.error('Enter an email address');
            return;
          }
          payload = {
            email: qrEmail,
            subject: qrEmailSubject,
            message: qrEmailMessage,
          };
          break;
        }
        case 'phone': {
          if (!qrPhone.trim()) {
            toast.error('Enter a phone number');
            return;
          }
          payload = { number: qrPhone };
          break;
        }
        case 'sms': {
          if (!qrSmsNumber.trim()) {
            toast.error('Enter a phone number');
            return;
          }
          payload = {
            number: qrSmsNumber,
            message: qrSmsMessage,
          };
          break;
        }
        case 'whatsapp': {
          if (!qrWhatsAppNumber.trim()) {
            toast.error('Enter a WhatsApp number');
            return;
          }
          payload = {
            number: qrWhatsAppNumber,
            message: qrWhatsAppMessage,
          };
          break;
        }
      }

      const response = await fetch('/api/text/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: qrType, payload }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      toast.success('QR code downloaded!');
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[90vh] max-w-3xl rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-bold">🔳 QR Code Studio</h2>
            <p className="mt-1 text-sm text-slate-500">
              Generate QR codes for links, text, WiFi, contact actions, and more in one place.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {(['url', 'text', 'wifi', 'email', 'phone', 'sms', 'whatsapp'] as QRType[]).map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() => setQrType(type)}
                className={`rounded-full border px-3 py-2 text-xs ${
                  qrType === type
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {type === 'url' && 'URL'}
                {type === 'text' && 'Text'}
                {type === 'wifi' && 'WiFi'}
                {type === 'email' && 'Email'}
                {type === 'phone' && 'Phone'}
                {type === 'sms' && 'SMS'}
                {type === 'whatsapp' && 'WhatsApp'}
              </button>
            )
          )}
        </div>

        {qrType === 'url' && (
          <input
            value={qrUrl}
            onChange={(e) => setQrUrl(e.target.value)}
            placeholder="https://example.com"
            className="mb-4 w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
        )}

        {qrType === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter any text, note, or message..."
            className="mb-4 h-32 w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
        )}

        {qrType === 'wifi' && (
          <div className="mb-4 space-y-3">
            <input
              value={qrWifiSsid}
              onChange={(e) => setQrWifiSsid(e.target.value)}
              placeholder="WiFi network name (SSID)"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <input
              type="password"
              value={qrWifiPassword}
              onChange={(e) => setQrWifiPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <select
              value={qrWifiEncryption}
              onChange={(e) => setQrWifiEncryption(e.target.value as 'WPA' | 'WPA2' | 'NONE')}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="NONE">None (open network)</option>
            </select>
          </div>
        )}

        {qrType === 'email' && (
          <div className="mb-4 space-y-3">
            <input
              type="email"
              value={qrEmail}
              onChange={(e) => setQrEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <input
              value={qrEmailSubject}
              onChange={(e) => setQrEmailSubject(e.target.value)}
              placeholder="Subject (optional)"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <textarea
              value={qrEmailMessage}
              onChange={(e) => setQrEmailMessage(e.target.value)}
              placeholder="Message (optional)"
              className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
          </div>
        )}

        {qrType === 'phone' && (
          <input
            value={qrPhone}
            onChange={(e) => setQrPhone(e.target.value)}
            placeholder="Phone number (e.g. +1234567890)"
            className="mb-4 w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
        )}

        {qrType === 'sms' && (
          <div className="mb-4 space-y-3">
            <input
              value={qrSmsNumber}
              onChange={(e) => setQrSmsNumber(e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <textarea
              value={qrSmsMessage}
              onChange={(e) => setQrSmsMessage(e.target.value)}
              placeholder="Message (optional)"
              className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
          </div>
        )}

        {qrType === 'whatsapp' && (
          <div className="mb-4 space-y-3">
            <input
              value={qrWhatsAppNumber}
              onChange={(e) => setQrWhatsAppNumber(e.target.value)}
              placeholder="WhatsApp number (e.g. 1234567890)"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
            <textarea
              value={qrWhatsAppMessage}
              onChange={(e) => setQrWhatsAppMessage(e.target.value)}
              placeholder="Prefilled message (optional)"
              className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="mt-2 w-full rounded-full bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700"
        >
          Download QR
        </button>
      </div>
    </motion.div>
  );
}


