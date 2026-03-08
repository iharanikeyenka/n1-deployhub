import type { Session } from '@supabase/supabase-js';
import { LogOut, Rocket } from 'lucide-react';

import { Button } from '@/components/atoms/button';

interface HeaderProps {
  session: Session;
  onSignOut: () => void;
}

export function Header({ session, onSignOut }: HeaderProps) {
  const userEmail = session.user.email ?? session.user.id;

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Deployer Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline">{userEmail}</span>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
