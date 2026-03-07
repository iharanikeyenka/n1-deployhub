import { useMemo, useState } from "react";
import { Input } from "@/components/atoms/input";
import { Skeleton } from "@/components/atoms/skeleton";
import { ProjectCard } from "@/components/molecules/ProjectCard";
import { Search } from "lucide-react";
import type { Project } from "@/box";

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
}

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [projects, search],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Projects ({loading ? "…" : filtered.length})
        </h2>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))
          : filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
      </div>
    </main>
  );
}
