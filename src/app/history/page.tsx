'use client';

import {
  File,
  History,
  MoreVertical,
  Search,
  UploadCloud,
  Menu
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';

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

const historyData: any[] = [];

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="hidden items-center gap-2 sm:flex">
            <Logo />
            <span className="sr-only">Titan Neural Network</span>
          </Link>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold">Titan Neural Network</h1>
            <p className="text-sm text-muted-foreground">
              Document Intelligence Platform
            </p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="link" className="text-muted-foreground" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" className="text-foreground">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">A list of links to navigate the site.</SheetDescription>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium mt-4">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo />
                <span>Titan Neural Network</span>
              </Link>
              <Link href="/" className="text-muted-foreground">
                Home
              </Link>
              <Link href="/history" className="text-foreground">
                History
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>Processing History</CardTitle>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search history..." className="pl-10 w-full md:w-auto" />
                </div>
                <Button asChild>
                  <Link href="/">
                    <UploadCloud className="mr-2" />
                    New Upload
                  </Link>
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
                {historyData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-10"
                    >
                      You haven't processed any documents yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyData.map((item) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
