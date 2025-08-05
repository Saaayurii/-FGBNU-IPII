'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface Subscriber {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export function SubscribersList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<Subscriber[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchedSubscribers: Subscriber[] = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        isActive: true,
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        isActive: false,
      },
      {
        id: 3,
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        isActive: true,
      },
    ];
    setSubscribers(fetchedSubscribers);
  }, []);

  const handleCheckboxChange = (subscriber: Subscriber) => {
    setSelectedSubscribers((prev) =>
      prev.includes(subscriber)
        ? prev.filter((s) => s.id !== subscriber.id)
        : [...prev, subscriber]
    );
  };

  const handleSendNewsletter = () => {
    if (!newsletterSubject || !newsletterContent) {
      alert('Please enter both subject and content.');
      return;
    }

    alert(
      `Newsletter sent to ${selectedSubscribers.map((s) => s.email).join(', ')}`
    );

    setIsDialogOpen(false);
    setNewsletterSubject('');
    setNewsletterContent('');
    setSelectedSubscribers([]);
  };

  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedSubscribers.length === 0}>
              Send Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Newsletter</DialogTitle>
              <DialogDescription>
                Sending newsletter to {selectedSubscribers.length} subscriber
                {selectedSubscribers.length !== 1 && 's'}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  placeholder="Enter newsletter subject"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Input
                  id="content"
                  value={newsletterContent}
                  onChange={(e) => setNewsletterContent(e.target.value)}
                  placeholder="Enter newsletter content"
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleSendNewsletter}>Send</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>
                <Checkbox
                  checked={selectedSubscribers.includes(subscriber)}
                  onCheckedChange={() => handleCheckboxChange(subscriber)}
                />
              </TableCell>
              <TableCell>{subscriber.name}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>
                <Badge
                  variant="default"
                  className={cn(
                    subscriber.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {subscriber.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
