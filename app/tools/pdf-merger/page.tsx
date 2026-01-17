'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    const pdfFiles = uploadedFiles.filter(f => f.type === 'application/pdf');
    
    if (pdfFiles.length !== uploadedFiles.length) {
      toast.error('Only PDF files are allowed');
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    toast.success(`${pdfFiles.length} PDF(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const mergePDFs = () => {
    toast.info('PDF merging requires backend API');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Upload PDF Files</h3>
              <p className="text-sm text-muted-foreground">
                Select multiple PDF files to merge them into one
              </p>
            </div>
            <label htmlFor="pdf-upload">
              <Button asChild size="lg">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose PDF Files
                </span>
              </Button>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <>
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={mergePDFs} size="lg" disabled={files.length < 2}>
              <Download className="h-4 w-4 mr-2" />
              Merge PDFs
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
