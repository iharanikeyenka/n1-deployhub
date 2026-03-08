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
      className: 'bg-[#e8192c] text-white hover:bg-[#ff2236] hover:shadow-[0_0_12px_rgba(232,25,44,0.4)]',
      available: !!(project.cmd_cms && project.cmd_deploy_master),
    },
    {
      action: 'cms',
      label: 'CMS Transfer',
      icon: <DatabaseZap className="h-3 w-3" />,
      className:
        'bg-[#202026] text-[#c8c8d8] border border-[#2a2a32] hover:bg-[#26262e] hover:border-[#3a3a44] hover:text-white',
      available: !!project.cmd_cms,
    },
    {
      action: 'deploy_master',
      label: 'Deploy Master',
      icon: <GitMerge className="h-3 w-3" />,
      className:
        'bg-transparent text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50',
      available: !!project.cmd_deploy_master,
    },
    {
      action: 'deploy_develop',
      label: 'Deploy Develop',
      icon: <GitPullRequest className="h-3 w-3" />,
      className:
        'bg-transparent text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500/50',
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

      <h3 className="font-display text-[13px] font-bold uppercase px-4 pt-4 pb-3 tracking-wide text-white leading-tight">
        {project.name}
      </h3>

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
