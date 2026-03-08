import { ReactNode, useState } from 'react';

import { DeployAction, Project, sendSlackCommand } from '@/box';
import { DatabaseZap, GitMerge, GitPullRequest, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

interface ActionButton {
  action: DeployAction;
  label: string;
  icon: ReactNode;
  className: string;
  available: boolean;
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

  const buttons: ActionButton[] = [
    {
      action: 'full_deploy',
      label: 'Full Deploy',
      icon: <Rocket className="h-3 w-3" />,
      className: 'bg-[#e8192c] text-white hover:bg-[#ff2236] hover:shadow-[0_0_16px_rgba(232,25,44,0.4)]',
      available: !!(project.cmd_cms && project.cmd_deploy_master),
    },
    {
      action: 'cms',
      label: 'CMS Transfer',
      icon: <DatabaseZap className="h-3 w-3" />,
      className:
        'bg-[#1e2a3a] text-[#7eb8f7] border border-[#2a3f58] hover:bg-[#243248] hover:border-[#3a5578] hover:text-[#a8d4ff]',
      available: !!project.cmd_cms,
    },
    {
      action: 'deploy_master',
      label: 'Deploy Master',
      icon: <GitMerge className="h-3 w-3" />,
      className:
        'bg-[#2a1f00] text-[#f5a623] border border-[#4a3800] hover:bg-[#332500] hover:border-[#6b5200] hover:text-[#ffc14d]',
      available: !!project.cmd_deploy_master,
    },
    {
      action: 'deploy_develop',
      label: 'Deploy Develop',
      icon: <GitPullRequest className="h-3 w-3" />,
      className:
        'bg-[#002a1e] text-[#2dd4a0] border border-[#004d38] hover:bg-[#003828] hover:border-[#007a58] hover:text-[#5eedc0]',
      available: !!project.cmd_deploy_develop,
    },
  ];

  const visibleButtons = buttons.filter((b) => b.available);
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
        {visibleButtons.map(({ action, label, icon, className }) => (
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
