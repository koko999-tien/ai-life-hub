'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Resource, ResourceType } from '@/types';
import { RESOURCE_TYPE_COLORS, RESOURCE_TYPE_LABELS } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';

const RESOURCE_TYPES_ORDER: ResourceType[] = [
  'tool',
  'article',
  'course',
  'paper',
  'video',
  'newsletter',
  'glossary',
];

interface RawSearchDoc {
  id: string;
  type: string;
  resourceType?: ResourceType;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  tags?: string[];
}

export default function ResourcesPage() {
  const [selectedType, setSelectedType] = useState<'all' | ResourceType>('all');
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setLoadError(false);
        if (data.documents) {
          const resDocs: Resource[] = (data.documents as RawSearchDoc[])
            .filter((d) => d.type === 'resource')
            .map((d) => ({
              id: d.id.replace('resource:', ''),
              type: d.resourceType || 'tool',
              title: d.title,
              description: d.description || d.content || '',
              url: d.url || '#',
              source: '',
              free: true,
              language: 'vi' as const,
              tags: d.tags || [],
            }));
          setAllResources(resDocs);
        }
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { all: allResources.length };
    allResources.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [allResources]);

  const filtered = useMemo(
    () => (selectedType === 'all' ? allResources : allResources.filter((r) => r.type === selectedType)),
    [allResources, selectedType]
  );

  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <h1 className="heading-1 mb-4 text-text">Kho tài nguyên AI</h1>
      <p className="text-fluid-lg text-text-muted mb-8">
        Tổng hợp tài liệu, khóa học, công cụ và nghiên cứu hữu ích giúp bạn học và ứng dụng AI hiệu quả hơn.
      </p>

      <div
        className="flex flex-wrap gap-2 pb-4 mb-4"
        role="group"
        aria-label="Lọc tài nguyên theo loại"
      >
        <Button
          type="button"
          variant={selectedType === 'all' ? 'primary' : 'outline'}
          onClick={() => setSelectedType('all')}
          size="sm"
          className="whitespace-nowrap"
          aria-pressed={selectedType === 'all'}
        >
          Tất cả ({countsByType.all || 0})
        </Button>
        {RESOURCE_TYPES_ORDER.map((type) => (
          <Button
            key={type}
            type="button"
            variant={selectedType === type ? 'primary' : 'outline'}
            onClick={() => setSelectedType(type)}
            size="sm"
            className="whitespace-nowrap"
            aria-pressed={selectedType === type}
          >
            {RESOURCE_TYPE_LABELS[type]} ({countsByType[type] || 0})
          </Button>
        ))}
      </div>

      {!isLoading && !loadError && (
        <p className="text-sm text-text-muted mb-6">
          Hiển thị <span className="font-semibold text-text">{filtered.length}</span> / {allResources.length} tài nguyên
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Đang tải tài nguyên">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-5 w-20 rounded-full bg-bg-hover" />
              <div className="h-6 w-3/4 rounded bg-bg-hover" />
              <div className="h-4 w-full rounded bg-bg-hover" />
              <div className="h-4 w-2/3 rounded bg-bg-hover" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-8 text-center"
        >
          <p className="text-base font-semibold text-red-700 dark:text-red-300 mb-1">
            Không thể tải danh sách tài nguyên
          </p>
          <p className="text-sm text-red-600/90 dark:text-red-400/90">
            Đã xảy ra lỗi khi kết nối dữ liệu. Vui lòng tải lại trang hoặc thử lại sau.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-bg-elevated p-10 text-center">
          <p className="text-base font-medium text-text mb-2">
            Chưa có tài nguyên nào thuộc mục &ldquo;{selectedType === 'all' ? 'Tất cả' : RESOURCE_TYPE_LABELS[selectedType]}&rdquo;.
          </p>
          <p className="text-sm text-text-muted mb-4">
            Bạn có thể xem toàn bộ tài nguyên hiện có ở mục Tất cả.
          </p>
          {selectedType !== 'all' && (
            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedType('all')}>
              Xem tất cả tài nguyên ({allResources.length})
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((res: Resource) => (
            <article key={res.id} className="card p-6 flex flex-col">
              <span
                className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
                  RESOURCE_TYPE_COLORS[res.type] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {RESOURCE_TYPE_LABELS[res.type] || res.type}
              </span>
              <h2 className="heading-4 mb-2 text-text">{res.title}</h2>
              <p className="text-sm text-text-muted flex-1 mb-4">{res.description}</p>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm w-full flex items-center justify-center gap-2 mt-auto"
              >
                Truy cập tài nguyên <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
