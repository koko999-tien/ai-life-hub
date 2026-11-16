'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { getAllSkills, getAllResources, Skill, Resource } from '@/lib/data';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API search
    const timer = setTimeout(() => {
      const allSkills = getAllSkills();
      const allResources = getAllResources();
      
      if (!query.trim()) {
        setSkills([]);
        setResources([]);
      } else {
        const q = query.toLowerCase();
        setSkills(allSkills.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)));
        setResources(allResources.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)));
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container py-12">
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
              {skills.map(skill => (
                <a key={skill.slug} href={`/skill/${skill.slug}`} className="card p-4 block hover:border-primary/20">
                  <h3 className="font-medium">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </a>
              ))}
            </div>
          </section>
          <section>
            <h2 className="heading-4 mb-4">Tài nguyên ({resources.length})</h2>
            <div className="space-y-4">
              {resources.map(res => (
                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="card p-4 block hover:border-primary/20">
                  <h3 className="font-medium">{res.title}</h3>
                  <p className="text-sm text-muted-foreground">{res.description}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}