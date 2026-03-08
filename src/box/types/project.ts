export interface Project {
  id: string;
  name: string;
  slack_channel_id: string;
  sort_order: number;
  group: string | null;
  cmd_cms: string | null;
  cmd_deploy_master: string | null;
  cmd_deploy_develop: string | null;
}

export type DeployAction = 'full_deploy' | 'cms' | 'deploy_master' | 'deploy_develop';

export interface DeployActionConfig {
  action: DeployAction;
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  colorClass?: string;
}
