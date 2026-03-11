import { DeployAction } from '@/box/constants/actions';

export interface Project {
  id: string;
  name: string;
  sort_order: number;
  group: string | null;
  cmd_cms: string | null;
  cmd_deploy_master: string | null;
  cmd_deploy_develop: string | null;
}

export interface DeployActionConfig {
  action: DeployAction;
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  colorClass?: string;
}
