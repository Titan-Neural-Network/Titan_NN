'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  File,
  Camera,
  Loader2,
  History,
  FileText,
  Zap,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  FileClock,
  Info,
  CircleDot,
  Badge,
  Download,
  FileJson,
  FileCode,
  Key,
  AlertTriangle,
  ClipboardList,
  Newspaper,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  processDocument,
  type ProcessDocumentOutput,
} from '@/ai/flows/document-processor';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge as BadgeComponent } from '@/components/ui/badge';


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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

type ProcessingStepStatus = 'pending' | 'processing' | 'complete';

interface ProcessingStep {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  status: ProcessingStepStatus;
}

const initialProcessingSteps: ProcessingStep[] = [
    { key: 'upload', icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, title: 'Upload Complete', description: 'Files uploaded and validated', status: 'pending' },
    { key: 'auto-clean', icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, title: 'Auto-Clean', description: 'Deskewing images and splitting PDFs', status: 'pending' },
    { key: 'ocr', icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, title: 'OCR + Layout', description: 'Extracting text and detecting layout blocks', status: 'pending' },
    { key: 'chunking', icon: <FileClock className="h-6 w-6 text-primary" />, title: 'Document Chunking', description: 'Splitting into logical sections', status: 'pending' },
    { key: 'analysis', icon: <Info className="h-6 w-6 text-muted-foreground" />, title: 'AI Analysis', description: 'Generating summaries and extracting key facts', status: 'pending' },
    { key: 'quality', icon: <CircleDot className="h-6 w-6 text-muted-foreground" />, title: 'Quality Review', description: 'Validating results and flagging uncertainties', status: 'pending' },
];

function ProcessingStatus({ steps }: { steps: ProcessingStep[] }) {
    return (
        <div className="space-y-4">
            {steps.map((step) => (
                <Card
                    key={step.key}
                    className={cn('transition-all', {
                        'bg-green-500/10 border-green-500/20': step.status === 'complete',
                        'border-primary ring-2 ring-primary/50': step.status === 'processing',
                        'bg-card/50': step.status === 'pending',
                    })}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                {step.status === 'complete' ? <CheckCircle2 className="h-6 w-6 text-green-500" /> :
                                 step.status === 'processing' ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> :
                                 step.icon}
                            </div>
                            <div>
                                <p className="font-semibold">{step.title}</p>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                        <div
                            className={cn('text-xs font-semibold rounded-full px-2 py-1', {
                                'bg-green-500/20 text-green-500': step.status === 'complete',
                                'bg-primary/20 text-primary': step.status === 'processing',
                                'bg-muted/20 text-muted-foreground': step.status === 'pending',
                            })}
                        >
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                            {step.status === 'processing' && '...'}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DocumentUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(initialProcessingSteps);
  const [jobId, setJobId] = useState<string | null>(null);

  const runProcessingSimulation = () => {
        setLoading(true);
        setJobId(`job_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`);
        let currentStep = 0;
        const interval = setInterval(() => {
            setProcessingSteps(prevSteps => {
                const newSteps = [...prevSteps];
                if (currentStep < newSteps.length) {
                    if (currentStep > 0) {
                        newSteps[currentStep - 1].status = 'complete';
                    }
                    newSteps[currentStep].status = 'processing';
                }
                
                if (currentStep >= newSteps.length) {
                    clearInterval(interval);
                    const reader = new FileReader();
                    const file = fileInputRef.current?.files?.[0];
                    if (file) {
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
                    } else {
                         // This is a fallback if the file disappears.
                         // For now we'll mock the result.
                         setResult({
                            documentType: "Car Purchase Agreement",
                            summary: "This is a car purchase agreement between you (Rajesh Kumar) and Maruti Suzuki Delhi for a new Alto K10 VXI. Total cost is ₹6,85,000 with ₹1,50,000 down payment. The remaining ₹5,35,000 is financed through HDFC Bank at 8.5% interest for 5 years. The car comes with 2-year warranty and mandatory accessories worth ₹45,000. Delivery is scheduled for March 15, 2024. You need to sign multiple forms and provide PAN card copy before delivery.",
                         });
                         setLoading(false);
                    }
                    return newSteps.map(step => ({ ...step, status: 'complete' }));
                }
                
                currentStep++;
                return newSteps;
            });
        }, 1000); 
    };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setShowUploader(true);
      await processFile(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setShowUploader(true);
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setResult(null);
    setFileName(file.name);
    setProcessingSteps(initialProcessingSteps);
    if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
    }
    runProcessingSimulation();
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
    setShowUploader(false);
    setLoading(false);
    setProcessingSteps(initialProcessingSteps);
    setJobId(null);
  };

  const UploaderComponent = () => (
    <>
      <div className="mb-8">
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
    </>
  );

  const ResultComponent = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                 <Button variant="link" className="p-0 text-muted-foreground" onClick={resetState}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
                 </Button>
                <h1 className="text-3xl font-bold">Analysis Complete</h1>
                <p className="text-muted-foreground text-sm">Job ID: {jobId}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> TXT</Button>
                <Button variant="outline"><FileJson className="mr-2 h-4 w-4" /> JSON</Button>
                <Button variant="outline"><FileCode className="mr-2 h-4 w-4" /> HTML</Button>
                <Button onClick={resetState}><UploadCloud className="mr-2 h-4 w-4" /> New Upload</Button>
            </div>
        </div>

      <Tabs defaultValue="plain-english">
        <TabsList>
            <TabsTrigger value="plain-english"><Newspaper className="mr-2 h-4 w-4" /> Plain English</TabsTrigger>
            <TabsTrigger value="key-facts"><Key className="mr-2 h-4 w-4" /> Key Facts</TabsTrigger>
            <TabsTrigger value="risks-fees"><AlertTriangle className="mr-2 h-4 w-4" /> Risks & Fees</TabsTrigger>
            <TabsTrigger value="to-do"><ClipboardList className="mr-2 h-4 w-4" /> To-Do Items</TabsTrigger>
        </TabsList>
        <TabsContent value="plain-english">
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Newspaper /> Plain English Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{result!.summary}</p>

                    <div>
                        <h3 className="font-semibold mb-2">Document Citations</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <div><BadgeComponent variant="secondary">Page 1, Vehicle Details Section</BadgeComponent></div>
                                <div className="text-muted-foreground">Total amount ₹6,85,000</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div><BadgeComponent variant="secondary">Page 5, Loan Terms Para 3</BadgeComponent></div>
                                <div className="text-muted-foreground">2% monthly penalty</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div><BadgeComponent variant="secondary">Page 2, Delivery Schedule</BadgeComponent></div>
                                <div className="text-muted-foreground">Delivery date March 15</div>
                            </div>
                             <div className="flex justify-between items-center">
                                <div><BadgeComponent variant="secondary">Page 4, Additional Items</BadgeComponent></div>
                                <div className="text-muted-foreground">Mandatory accessories ₹45,000</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div><BadgeComponent variant="secondary">Page 6, Cancellation Policy</BadgeComponent></div>
                                <div className="text-muted-foreground">No cancellation after 7 days</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="key-facts">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Key /> Key Facts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Key facts will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="risks-fees">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <AlertTriangle /> Risks & Fees
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Risks and fees will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="to-do">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ClipboardList /> To-Do Items
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>To-do items will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
    </div>
  );

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
          <Button variant="link" className="text-foreground" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" className="text-muted-foreground" asChild>
            <Link href="/history">
              <History className="mr-2" />
              History
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="mx-auto max-w-4xl">
          {showUploader ? (
              <>
              {loading && !result && <ProcessingStatus steps={processingSteps} />}
              {!loading && !result && <UploaderComponent />}
              {!loading && result && <ResultComponent />}
              </>
          ) : (
            <div className="text-center">
              <div className="inline-block p-3 mb-4 bg-primary/10 rounded-lg">
                 <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Titanium-Grade
                <br />
                <span className="text-primary">Document Clarity</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Transform complex car purchase documents into clear, actionable insights. Our AI extracts key facts, identifies risks, and highlights what you need to do next.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" onClick={() => setShowUploader(true)}>
                  <UploadCloud className="mr-2"/>
                  Upload Documents
                </Button>
                <Button size="lg" variant="outline" asChild>
                   <Link href="/history">
                    <History className="mr-2"/>
                    View History
                   </Link>
                </Button>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Zap className="text-blue-400" />}
                    title="Lightning Fast OCR"
                    description="Advanced OCR with auto-cleaning, deskewing, and multi-language support extracts text with exceptional accuracy."
                />
                <FeatureCard 
                    icon={<BrainCircuit className="text-green-400" />}
                    title="AI-Powered Analysis"
                    description="Our neural network understands document structure, extracts key facts, and identifies potential risks in plain English."
                />
                <FeatureCard 
                    icon={<ShieldCheck className="text-purple-400" />}
                    title="Secure & Private"
                    description="Your documents are processed securely with optional PII redaction and enterprise-grade data protection."
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
