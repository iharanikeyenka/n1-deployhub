import { useProjects } from '@/box';
import { Session } from '@supabase/supabase-js';

import { Header } from '@/components/organisms/Header';
import { ProjectGrid } from '@/components/organisms/ProjectGrid';

interface DashboardProps {
  session: Session;
  onSignOut: () => void;
}

export function Dashboard({ session, onSignOut }: DashboardProps) {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onSignOut={onSignOut} />
      <ProjectGrid projects={projects} loading={loading} error={error} onRetry={refetch} />
    </div>
  );
}
