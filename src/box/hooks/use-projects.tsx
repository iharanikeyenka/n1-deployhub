import { fetchProjects } from '@/box/services/project.service.ts';
import type { Project } from '@/box/types/project.ts';
import { useQuery } from '@tanstack/react-query';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
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
