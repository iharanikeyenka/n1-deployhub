import { useMemo, useState } from 'react';

import type { Project } from '@/box';
import { LayoutGrid, ListChecks, Search } from 'lucide-react';

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
    <main className="container mx-auto px-6 py-8">
      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-baseline gap-3">
          <h2
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, letterSpacing: '0.04em' }}
            className="text-xl uppercase text-white"
          >
            Projects
          </h2>
          <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#8a8a9a]">
            {loading ? '…' : filtered.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a8a9a]" />
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-[#2a2a32] bg-[#202026] pl-8 text-sm text-white placeholder:text-[#8a8a9a] focus-visible:ring-[#e8192c]/50"
          />
        </div>

        {/* Mode toggle */}
        <div className="ml-auto flex items-center overflow-hidden rounded border border-[#2a2a32] bg-[#202026]">
          {(['grid', 'bulk'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em' }}
              className={`flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase transition-all ${
                mode === m ? 'bg-[#e8192c] text-white' : 'text-[#8a8a9a] hover:text-white'
              }`}
            >
              {m === 'grid' ? <LayoutGrid className="h-3 w-3" /> : <ListChecks className="h-3 w-3" />}
              {m === 'grid' ? 'Single' : 'Bulk'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded border border-[#2a2a32] bg-[#1a1a1e]" />
          ))}
        </div>
      ) : mode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <BulkDeployPanel projects={filtered} />
      )}
    </main>
  );
}
