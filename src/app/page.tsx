'use client';

import { useState, useRef } from 'react';
import {
  UploadCloud,
  File,
  Camera,
  Loader2,
  Search,
  Bell,
  Home,
  FileText,
  Cog,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  processDocument,
  type ProcessDocumentOutput,
} from '@/ai/flows/document-processor';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

function Logo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M2 7L12 12L22 7"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V22"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
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
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <Logo />
                <h2 className="text-lg font-semibold">
                  Universal Document Processing
                </h2>
              </div>
            </SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileText />
                  Documents
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Cog />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Shield />
                  Security
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-10"
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell />
              </Button>
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                  Upload your documents for processing
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Drag and drop your files here or click to browse.
                </p>
              </div>

              {!result && (
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
                        <p className="font-semibold">
                          Drag &amp; drop files here, or click to browse
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleBrowse} disabled={loading}>
                          <File className="mr-2" />
                          Browse Files
                        </Button>
                        <Button variant="secondary" disabled={true}>
                          <Camera className="mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground pt-4">
                        Supports PDF, PNG, JPG, JPEG, WebP • Max 50MB per file
                      </p>
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
                      <h2 className="text-xl font-semibold mb-4">File Uploaded</h2>
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
                          <p className="font-medium text-muted-foreground">Document Type</p>
                          <p className="font-semibold text-lg">{result.documentType}</p>
                        </div>
                         <div>
                          <p className="font-medium text-muted-foreground">Summary</p>
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
      </div>
    </SidebarProvider>
  );
}
