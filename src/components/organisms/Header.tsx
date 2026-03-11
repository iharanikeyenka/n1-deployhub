import type { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  session: Session;
  onSignOut: () => void;
}

export function Header({ session, onSignOut }: HeaderProps) {
  const userName =
    session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? session.user.email ?? session.user.id;

  const rawAvatar = session.user.user_metadata?.avatar_url;
  const avatar = typeof rawAvatar === 'string' ? rawAvatar : undefined;

  return (
    <header className="relative z-10 border-b border-[#2a2a32] bg-[#111113]">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="N1 Partners" className="h-7 w-auto" />
          <div className="h-5 w-px bg-[#2a2a32]" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest-2 text-white">Deploy Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2.5 sm:flex">
            {avatar ? (
              <img src={avatar} alt={userName} className="h-7 w-7 rounded-full object-cover ring-1 ring-[#2a2a32]" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#202026] ring-1 ring-[#2a2a32]">
                <span className="font-display text-xs font-bold uppercase text-[#8a8a9a]">{userName.charAt(0)}</span>
              </div>
            )}
            <span className="font-body text-sm text-[#8a8a9a]">{userName}</span>
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 rounded border border-[#2a2a32] bg-transparent px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-[#8a8a9a] transition-all hover:border-[#e8192c]/40 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#e8192c] to-transparent opacity-30" />
    </header>
  );
}
