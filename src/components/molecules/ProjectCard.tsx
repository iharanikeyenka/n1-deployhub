import { ReactNode, useState } from 'react';

import { DeployAction, Project, sendSlackCommand } from '@/box';
import { ArrowRightLeft, GitBranch, Rocket } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';

interface ProjectCardProps {
  project: Project;
}

interface ActionButton {
  action: DeployAction;
  label: string;
  icon: ReactNode;
  variant: 'default' | 'secondary' | 'outline';
  className?: string;
  available: boolean;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [pending, setPending] = useState<DeployAction | null>(null);

  const handleAction = async (action: DeployAction, label: string): Promise<void> => {
    setPending(action);
    try {
      await sendSlackCommand(project.id, action);
      toast.success(`✅ ${label} sent for ${project.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`❌ Failed: ${message}`);
    } finally {
      setPending(null);
    }
  };

  const buttons: ActionButton[] = [
    {
      action: 'full_deploy',
      label: '🔴 Full Deploy',
      icon: <Rocket className="mr-2 h-4 w-4" />,
      variant: 'default',
      available: !!(project.cmd_cms && project.cmd_deploy_master),
    },
    {
      action: 'cms',
      label: '🔴 CMS Transfer',
      icon: <ArrowRightLeft className="mr-2 h-4 w-4" />,
      variant: 'secondary',
      available: !!project.cmd_cms,
    },
    {
      action: 'deploy_master',
      label: '🟠 Deploy Master',
      icon: <Rocket className="mr-2 h-4 w-4" />,
      variant: 'outline',
      available: !!project.cmd_deploy_master,
    },
    {
      action: 'deploy_develop',
      label: '🟡 Deploy Develop',
      icon: <GitBranch className="mr-2 h-4 w-4" />,
      variant: 'outline',
      className: 'border-yellow-400 text-yellow-600 hover:bg-yellow-50',
      available: !!project.cmd_deploy_develop,
    },
  ];

  const visibleButtons = buttons.filter((b) => b.available);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {visibleButtons.map(({ action, label, icon, variant, className }) => (
          <Button
            key={action}
            variant={variant}
            className={`w-full ${className ?? ''}`}
            disabled={pending !== null}
            onClick={() => handleAction(action, label)}
          >
            {icon}
            {pending === action ? 'Sending...' : label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
