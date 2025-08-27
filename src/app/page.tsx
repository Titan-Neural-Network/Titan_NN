'use client';

import { useState, useRef } from 'react';
import {
  UploadCloud,
  File,
  Camera,
  Loader2,
  History,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  processDocument,
  type ProcessDocumentOutput,
} from '@/ai/flows/document-processor';

function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="hsl(var(--primary-foreground))"
        fontSize="18"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        T
      </text>
    </svg>
  );
}

export default function DocumentUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setResult(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const response = await processDocument({ documentDataUri: dataUri });
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'An error occurred.',
          description: 'Failed to process the document. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        variant: 'destructive',
        title: 'Error reading file.',
        description: 'Could not read the selected file.',
      });
      setLoading(false);
    };
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const resetState = () => {
    setResult(null);
    setFileName(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <div>
            <h1 className="text-lg font-bold">Titan Neural Network</h1>
            <p className="text-sm text-muted-foreground">
              Document Intelligence Platform
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Button variant="link" className="text-foreground">
            Home
          </Button>
          <Button variant="link" className="text-muted-foreground">
            <History className="mr-2" />
            History
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="mx-auto max-w-4xl">
          {!result && (
            <div>
              <div className="mb-8">
                <Button variant="link" className="px-0 text-muted-foreground">
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                  Upload Documents
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Drag and drop your car purchase documents or click to browse.
                  We support PDFs and images (PNG, JPG, JPEG, WebP).
                </p>
              </div>

              <Card
                className="border-2 border-dashed bg-card shadow-none"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CardContent className="p-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Upload your documents</p>
                      <p className="text-sm text-muted-foreground">
                        Drag &amp; drop files here, or click to browse
                      </p>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleBrowse} disabled={loading}>
                        <File className="mr-2" />
                        Browse Files
                      </Button>
                      <Button variant="secondary" disabled={true}>
                        <Camera className="mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                  />
                </CardContent>
              </Card>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Supports PDF, PNG, JPG, JPEG, WebP • Max 50MB per file
              </p>
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2">Processing {fileName || 'document'}...</p>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    File Uploaded
                  </h2>
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Response</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Document Type
                      </p>
                      <p className="font-semibold text-lg">
                        {result.documentType}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Summary
                      </p>
                      <p>{result.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={resetState}>Process Another Document</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
