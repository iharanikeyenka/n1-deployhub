import { useMemo, useState } from 'react';

import type { Project } from '@/box';
import { LayoutGrid, ListChecks, Search } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Skeleton } from '@/components/atoms/skeleton';
import { BulkDeployPanel } from '@/components/molecules/BulkDeployPanel';
import { ProjectCard } from '@/components/molecules/ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
}

type ViewMode = 'grid' | 'bulk';

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<ViewMode>('grid');

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">Projects ({loading ? '…' : filtered.length})</h2>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Mode toggle */}
        <div className="flex items-center rounded-md border border-border bg-muted p-1 gap-1">
          <Button
            variant={mode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs"
            onClick={() => setMode('grid')}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Single
          </Button>
          <Button
            variant={mode === 'bulk' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs"
            onClick={() => setMode('bulk')}
          >
            <ListChecks className="h-3.5 w-3.5" />
            Bulk
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : mode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <BulkDeployPanel projects={filtered} />
      )}
    </main>
  );
}
