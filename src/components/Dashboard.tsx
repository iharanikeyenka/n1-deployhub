import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { Rocket, LogOut } from 'lucide-react';

interface DashboardProps {
  session: Session;
  onSignOut: () => void;
}

const MOCK_PROJECTS = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Website Beta' },
  { id: '3', name: 'Shop CRM' },
];

export function Dashboard({ session, onSignOut }: DashboardProps) {
  const userEmail = session.user.email ?? session.user.id;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Deployer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userEmail}
            </span>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard key={project.id} name={project.name} />
          ))}
        </div>
      </main>
    </div>
  );
}
