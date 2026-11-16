'use client';

import { useState } from 'react';
import { getAllResources, Resource } from '@/lib/data';
import { ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ResourcesPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const allResources = getAllResources();

  const filtered = selectedType === 'all' 
    ? allResources 
    : allResources.filter(r => r.type === selectedType);

  return (
    <div className="container py-12">
      <h1 className="heading-1 mb-4">Kho tài nguyên AI</h1>
      <p className="text-fluid-lg text-muted-foreground mb-8">
        Tổng hợp tài liệu, khóa học, công cụ và bài nghiên cứu hàng đầu về AI.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
        {['all', 'article', 'video', 'course', 'tool', 'paper', 'template'].map(type => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            onClick={() => setSelectedType(type)}
            size="sm"
            className="capitalize whitespace-nowrap"
          >
            {type === 'all' ? 'Tất cả' : type}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((res: Resource) => (
          <article key={res.id} className="card p-6 flex flex-col">
            <span className="badge badge-secondary self-start mb-3 capitalize">{res.type}</span>
            <h2 className="heading-4 mb-2">{res.title}</h2>
            <p className="text-sm text-muted-foreground flex-1 mb-4">{res.description}</p>
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-sm w-full flex items-center justify-center gap-2 mt-auto"
            >
              Truy cập tài nguyên <ExternalLink className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}