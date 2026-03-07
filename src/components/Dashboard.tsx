import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";
import { Rocket, LogOut, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  name: string;
  slack_channel_id: string;
}

interface DashboardProps {
  session: Session;
  onSignOut: () => void;
}

export function Dashboard({ session, onSignOut }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const userEmail = session.user.email ?? session.user.id;

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setProjects(data);
      });
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              Deployer Dashboard
            </h1>
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
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Projects ({filtered.length})
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
          {filtered.map((project) => (
            <ProjectCard key={project.id} id={project.id} name={project.name} />
          ))}
        </div>
      </main>
    </div>
  );
}
