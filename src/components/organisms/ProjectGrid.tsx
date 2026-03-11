import { ReactNode, useMemo, useState } from 'react';

import type { Project } from '@/box';
import { LayoutGrid, ListChecks, Search } from 'lucide-react';

import { Input } from '@/components/atoms/input';
import { Skeleton } from '@/components/atoms/skeleton';
import { BulkDeployPanel } from '@/components/molecules/BulkDeployPanel';
import { ProjectCard } from '@/components/molecules/ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

type ViewMode = 'grid' | 'bulk';

const VIEW_MODES: { mode: ViewMode; label: string; icon: ReactNode }[] = [
  { mode: 'grid', label: 'Single', icon: <LayoutGrid className="h-3 w-3" /> },
  { mode: 'bulk', label: 'Bulk', icon: <ListChecks className="h-3 w-3" /> },
];

export function ProjectGrid({ projects, loading, error, onRetry }: ProjectGridProps) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<ViewMode>('grid');

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search],
  );

  if (error) {
    return (
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={onRetry}
            className="rounded border border-[#2a2a32] px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-[#8a8a9a] transition-all hover:border-[#e8192c]/40 hover:text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-xl font-black uppercase tracking-wide text-white">Projects</h2>
          <span className="font-body text-sm text-[#8a8a9a]">{loading ? '…' : filtered.length}</span>
        </div>

        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a8a9a]" />
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-[#2a2a32] bg-[#202026] pl-8 text-sm text-white placeholder:text-[#8a8a9a] focus-visible:ring-[#e8192c]/50"
          />
        </div>

        <div className="ml-auto flex overflow-hidden rounded border border-[#2a2a32] bg-[#202026]">
          {VIEW_MODES.map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-widest transition-all ${
                mode === m ? 'bg-[#e8192c] text-white' : 'text-[#8a8a9a] hover:text-white'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

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
