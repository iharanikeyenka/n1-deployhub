import { ReactNode } from 'react';

import type { Project } from '@/box';
import { DatabaseZap, GitMerge, GitPullRequest, Rocket } from 'lucide-react';

export interface ActionDef {
  action: DeployAction;
  label: string;
  icon: ReactNode;
  className: string;
  available: boolean;
}

export enum DeployAction {
  FULL_DEPLOY = 'full_deploy',
  CMS = 'cms',
  DEPLOY_MASTER = 'deploy_master',
  DEPLOY_DEVELOP = 'deploy_develop',
}

const ACTION_STYLES = [
  {
    action: 'full_deploy' as DeployAction,
    label: 'Full Deploy',
    icon: <Rocket className="h-3 w-3" />,
    className: 'bg-[#e8192c] text-white hover:bg-[#ff2236] hover:shadow-[0_0_16px_rgba(232,25,44,0.4)]',
    getAvailable: (p: Project) => !!(p.cmd_cms && p.cmd_deploy_master),
  },
  {
    action: 'cms' as DeployAction,
    label: 'CMS Transfer',
    icon: <DatabaseZap className="h-3 w-3" />,
    className:
      'bg-[#1e2a3a] text-[#7eb8f7] border border-[#2a3f58] hover:bg-[#243248] hover:border-[#3a5578] hover:text-[#a8d4ff]',
    getAvailable: (p: Project) => !!p.cmd_cms,
  },
  {
    action: 'deploy_master' as DeployAction,
    label: 'Deploy Master',
    icon: <GitMerge className="h-3 w-3" />,
    className:
      'bg-[#2a1f00] text-[#f5a623] border border-[#4a3800] hover:bg-[#332500] hover:border-[#6b5200] hover:text-[#ffc14d]',
    getAvailable: (p: Project) => !!p.cmd_deploy_master,
  },
  {
    action: 'deploy_develop' as DeployAction,
    label: 'Deploy Develop',
    icon: <GitPullRequest className="h-3 w-3" />,
    className:
      'bg-[#002a1e] text-[#2dd4a0] border border-[#004d38] hover:bg-[#003828] hover:border-[#007a58] hover:text-[#5eedc0]',
    getAvailable: (p: Project) => !!p.cmd_deploy_develop,
  },
];

export const getActionDefs = (): Omit<ActionDef, 'available'>[] =>
  ACTION_STYLES.map(({ getAvailable: _, ...rest }) => rest);
