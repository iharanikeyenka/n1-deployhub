import { useState } from 'react';

import { DeployAction, Project, getProjectActionDefs, sendSlackCommand } from '@/box';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [pending, setPending] = useState<DeployAction | null>(null);

  const handleAction = async (action: DeployAction, label: string): Promise<void> => {
    setPending(action);
    try {
      await sendSlackCommand(project.id, action);
      toast.success(`${label} — ${project.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed: ${message}`);
    } finally {
      setPending(null);
    }
  };

  const buttons = getProjectActionDefs(project).filter((b) => b.available);
  const delayClass = `animate-delay-${Math.min((index % 6) + 1, 6)}`;

  return (
    <div
      className={`
        group flex flex-col overflow-hidden rounded border border-[#2a2a32] bg-[#1a1a1e]
        animate-fade-up opacity-0 ${delayClass}
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-[#e8192c]/30
        hover:shadow-[0_0_0_1px_rgba(232,25,44,0.08),0_8px_32px_rgba(0,0,0,0.5)]
      `}
    >
      <div className="h-[2px] w-full bg-[#e8192c] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <h3 className="font-display text-[13px] font-bold uppercase tracking-wide text-white leading-tight">
          {project.name}
        </h3>
      </div>

      <div className="mx-4 h-px bg-[#2a2a32]" />

      <div className="flex flex-col gap-1.5 px-4 pb-4 pt-3">
        {buttons.map(({ action, label, icon, className }) => (
          <button
            key={action}
            disabled={pending !== null}
            onClick={() => handleAction(action, label)}
            className={`
              flex w-full items-center justify-center gap-2 rounded px-3 py-2
              font-display text-[11px] font-bold uppercase tracking-wider
              transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40
              ${className}
            `}
          >
            {pending === action ? <Loader2 className="h-3 w-3 animate-spin" /> : icon}
            {pending === action ? 'Sending…' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
