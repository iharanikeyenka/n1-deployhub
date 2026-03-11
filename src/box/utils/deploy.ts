import { DeployAction } from '@/box/constants/actions';
import type { Project } from '@/box/types/project';

export function isActionAvailable(project: Project, action: DeployAction): boolean {
  switch (action) {
    case DeployAction.FULL_DEPLOY:
      return !!(project.cmd_cms && project.cmd_deploy_master);
    case DeployAction.CMS:
      return !!project.cmd_cms;
    case DeployAction.DEPLOY_MASTER:
      return !!project.cmd_deploy_master;
    case DeployAction.DEPLOY_DEVELOP:
      return !!project.cmd_deploy_develop;
  }
}

export function getEligibleTargets(projects: Project[], selected: Set<string>, action: DeployAction): Project[] {
  return projects.filter((p) => selected.has(p.id) && isActionAvailable(p, action));
}
