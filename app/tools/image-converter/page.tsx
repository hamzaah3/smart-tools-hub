'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [format, setFormat] = useState('png');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (!uploadedFile.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      toast.success('Image uploaded!');
    }
  };

  const convertImage = () => {
    toast.info('Image conversion requires backend API or canvas processing');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Upload Image</h3>
              <p className="text-sm text-muted-foreground">
                Support for JPG, PNG, WEBP, GIF, AVIF
              </p>
            </div>
            <label htmlFor="image-upload">
              <Button asChild size="lg">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </span>
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {file && preview && (
        <>
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Preview</h3>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto mx-auto rounded-lg border-2"
              />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {file.name} • {(file.size / 1024).toFixed(2)} KB
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Convert to Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                      <SelectItem value="avif">AVIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={convertImage} className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Convert to {format.toUpperCase()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
