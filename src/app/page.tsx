'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, History, Home, UploadCloud, File, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { processDocument, type ProcessDocumentOutput } from '@/ai/flows/document-processor';

function TIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#111827" />
      <path
        d="M9 8H15M12 8V16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DocumentUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        toast({
          title: 'Processing Complete',
          description: 'The document has been successfully processed.',
        });
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
    }
  };


  const handleBrowse = () => {
    fileInputRef.current?.click();
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  return (
    <div className="flex min-h-full w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <TIcon />
          <div>
            <h1 className="text-lg font-bold">Titan Neural Network</h1>
            <p className="text-sm text-muted-foreground">Document Intelligence Platform</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-sm font-medium hover:underline">
            <Home className="h-4 w-4" />
            Home
          </a>
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:underline">
            <History className="h-4 w-4" />
            History
          </a>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="mx-auto max-w-4xl">
            <Button variant="link" className="p-0 h-auto mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
                <p className="mt-2 text-muted-foreground">
                    Drag and drop your car purchase documents or click to browse. We support PDFs and images (PNG, JPG, JPEG, WebP).
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
                    <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleBrowse} disabled={loading}>
                      <File className="mr-2"/>
                      Browse Files
                    </Button>
                    <Button variant="secondary" disabled={true}>
                      <Camera className="mr-2" />
                      Take Photo
                    </Button>
                  </div>
                   <p className="text-xs text-muted-foreground pt-4">Supports PDF, PNG, JPG, JPEG, WebP • Max 50MB per file</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf,image/png,image/jpeg,image/webp" />
              </CardContent>
            </Card>

            {loading && (
              <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2">Processing {fileName || 'document'}...</p>
              </div>
            )}
            
            {result && (
              <Card className="mt-8 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Processing Result</h2>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {result.documentType}</p>
                    <p><strong>Summary:</strong> {result.summary}</p>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </div>
  );
}
