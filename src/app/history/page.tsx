'use client';

import {
  File,
  History,
  MoreVertical,
  Search,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

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

const historyData = [
  {
    id: 'job_1720101412_abc123',
    fileName: 'Maruti_Alto_Purchase_Agreement.pdf',
    date: '2024-07-04',
    type: 'Car Purchase Agreement',
    status: 'Completed',
    summary: 'Agreement for a new Alto K10 VXI. Total cost is ₹6,85,000...',
  },
  {
    id: 'job_1720050012_def456',
    fileName: 'HDFC_Loan_Documents.pdf',
    date: '2024-07-03',
    type: 'Loan Agreement',
    status: 'Completed',
    summary: 'Financing of ₹5,35,000 through HDFC Bank at 8.5% interest...',
  },
  {
    id: 'job_1719123456_ghi789',
    fileName: 'Car_Insurance_Policy.jpg',
    date: '2024-06-23',
    type: 'Insurance Policy',
    status: 'Completed',
    summary: 'Comprehensive insurance policy from Acko for the new vehicle...',
  },
  {
    id: 'job_1718567890_jkl012',
    fileName: 'Vehicle_Registration.pdf',
    date: '2024-06-16',
    type: 'Registration Card',
    status: 'Failed',
    summary: 'Failed to extract information due to poor image quality.',
  },
  {
    id: 'job_1718012345_mno345',
    fileName: 'Invoice_for_Accessories.png',
    date: '2024-06-10',
    type: 'Invoice',
    status: 'Completed',
    summary: 'Invoice for mandatory accessories worth ₹45,000.',
  },
];

export default function HistoryPage() {
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
          <Button variant="link" className="text-muted-foreground" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" className="text-foreground">
            <History className="mr-2" />
            History
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Processing History</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search history..." className="pl-10" />
                </div>
                <Button>
                  <UploadCloud className="mr-2" />
                  New Upload
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <File className="text-muted-foreground" /> {item.fileName}
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'Completed'
                            ? 'default'
                            : 'destructive'
                        }
                        className={
                          item.status === 'Completed'
                            ? 'bg-green-500/20 text-green-500 border-transparent'
                            : ''
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-sm truncate">
                      {item.summary}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
