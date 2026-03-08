import { SlackIcon } from 'lucide-react';

interface LoginScreenProps {
  onSignIn: () => void;
}

export function LoginScreen({ onSignIn }: LoginScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111113]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 68% 50%, rgba(232,25,44,0.07) 0%, transparent 70%)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 px-8 animate-fade-up">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" alt="N1 Partners" className="h-10 w-auto" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest-3 text-white">Deploy Hub</span>
        </div>
        <button
          onClick={onSignIn}
          className="flex items-center gap-3 rounded bg-[#e8192c] px-10 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#ff2236] hover:shadow-[0_0_28px_rgba(232,25,44,0.45)] active:scale-[0.98]"
        >
          <SlackIcon />
          Sign in with Slack
        </button>
      </div>
    </div>
  );
}
