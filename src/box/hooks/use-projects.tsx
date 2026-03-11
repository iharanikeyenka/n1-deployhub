import { fetchProjects } from '@/box/services/project.service';
import type { Project } from '@/box/types/project';
import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult } from '@tanstack/react-query';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<QueryObserverResult<Project[], Error>>;
}

export function useProjects(): UseProjectsResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    retry: 2,
    staleTime: 30_000,
  });

  return {
    projects: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
