'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { searchDocuments, type SearchResult } from '@/lib/search';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const searchRes = await searchDocuments(query);
        setResults(searchRes);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const skills = results.filter((r) => r.type === 'skill');
  const resources = results.filter((r) => r.type === 'resource');
  const otherResults = results.filter((r) => r.type !== 'skill' && r.type !== 'resource');

  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <h1 className="heading-2 mb-8">Tìm kiếm</h1>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm kỹ năng, tài nguyên..."
          className="pl-10 h-14 text-lg"
          autoFocus
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="heading-4 mb-4">Kỹ năng ({skills.length})</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <a key={skill.id} href={skill.url} className="card p-4 block hover:border-primary/20">
                  <h3 className="font-medium">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </a>
              ))}
              {skills.length === 0 && query && (
                <p className="text-sm text-muted-foreground">Không tìm thấy kỹ năng nào.</p>
              )}
            </div>
          </section>
          <section>
            <h2 className="heading-4 mb-4">Tài nguyên ({resources.length})</h2>
            <div className="space-y-4">
              {resources.map((res) => (
                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="card p-4 block hover:border-primary/20">
                  <h3 className="font-medium">{res.title}</h3>
                  <p className="text-sm text-muted-foreground">{res.description}</p>
                </a>
              ))}
              {resources.length === 0 && query && (
                <p className="text-sm text-muted-foreground">Không tìm thấy tài nguyên nào.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-section-x pt-24 pb-16">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}