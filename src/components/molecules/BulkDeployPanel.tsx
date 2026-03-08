import { useMemo, useState } from 'react';

import { DeployAction, Project, sendSlackCommand } from '@/box';
import { ChevronDown, ChevronRight, GitBranch, Rocket, Square, SquareCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/atoms/collapsible';

interface BulkDeployPanelProps {
  projects: Project[];
}

interface ActionDef {
  action: DeployAction;
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'outline';
  className?: string;
}

const ACTION_DEFS: ActionDef[] = [
  {
    action: 'full_deploy',
    label: '🔴 Full Deploy',
    icon: <Rocket className="h-3.5 w-3.5" />,
    variant: 'default',
  },
  {
    action: 'cms',
    label: '🔴 CMS Transfer',
    icon: <Rocket className="h-3.5 w-3.5" />,
    variant: 'secondary',
  },
  {
    action: 'deploy_master',
    label: '🟠 Deploy Master',
    icon: <Rocket className="h-3.5 w-3.5" />,
    variant: 'outline',
  },
  {
    action: 'deploy_develop',
    label: '🟡 Deploy Develop',
    icon: <GitBranch className="h-3.5 w-3.5" />,
    variant: 'outline',
    className: 'border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950',
  },
];

function isActionAvailable(project: Project, action: DeployAction): boolean {
  if (action === 'full_deploy') return !!(project.cmd_cms && project.cmd_deploy_master);
  if (action === 'cms') return !!project.cmd_cms;
  if (action === 'deploy_master') return !!project.cmd_deploy_master;
  if (action === 'deploy_develop') return !!project.cmd_deploy_develop;
  return false;
}

export function BulkDeployPanel({ projects }: BulkDeployPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<DeployAction | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['alfa', 'bravo']));

  const grouped = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const p of projects) {
      const key = p.group ?? 'uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }

    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }, [projects]);

  const toggleProject = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (groupProjects: Project[]) => {
    const groupIds = groupProjects.map((p) => p.id);
    const allSelected = groupIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        groupIds.forEach((id) => next.delete(id));
      } else {
        groupIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(projects.map((p) => p.id)));
  const clearAll = () => setSelected(new Set());

  const toggleGroupOpen = (groupName: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  const handleBulkAction = async (action: DeployAction, label: string) => {
    if (selected.size === 0) {
      toast.warning('No projects selected');
      return;
    }

    const targets = projects.filter((p) => selected.has(p.id) && isActionAvailable(p, action));

    if (targets.length === 0) {
      toast.warning(`No selected projects support "${label}"`);
      return;
    }

    setPending(action);

    let succeeded = 0;
    let failed = 0;

    for (const project of targets) {
      try {
        await sendSlackCommand(project.id, action);
        succeeded++;
      } catch {
        failed++;
      }
    }

    setPending(null);

    if (failed === 0) {
      toast.success(`✅ ${label} sent to ${succeeded} project${succeeded > 1 ? 's' : ''}`);
    } else {
      toast.error(`⚠️ ${succeeded} sent, ${failed} failed`);
    }
  };

  const selectedCount = selected.size;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Bulk Deploy</h3>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCount} selected
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Select all
          </button>
          <span className="text-muted-foreground/40">·</span>
          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* Group list */}
      <div className="divide-y divide-border">
        {[...grouped.entries()].map(([groupName, groupProjects]) => {
          const groupIds = groupProjects.map((p) => p.id);
          const selectedInGroup = groupIds.filter((id) => selected.has(id)).length;
          const allInGroupSelected = selectedInGroup === groupIds.length;
          const someInGroupSelected = selectedInGroup > 0 && !allInGroupSelected;
          const isOpen = openGroups.has(groupName);

          return (
            <Collapsible key={groupName} open={isOpen}>
              {/* Group row */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30">
                <div
                  onClick={() => toggleGroup(groupProjects)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  {allInGroupSelected ? (
                    <SquareCheck className="h-4 w-4 text-primary" />
                  ) : someInGroupSelected ? (
                    <Square className="h-4 w-4 text-primary/60" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </div>

                <CollapsibleTrigger asChild>
                  <button
                    onClick={() => toggleGroupOpen(groupName)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium capitalize text-foreground">{groupName}</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedInGroup > 0 ? `${selectedInGroup}/` : ''}
                      {groupProjects.length}
                    </span>
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="divide-y divide-border/50">
                  {groupProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => toggleProject(project.id)}
                    >
                      <Checkbox
                        checked={selected.has(project.id)}
                        onCheckedChange={() => toggleProject(project.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="flex-1 text-sm text-foreground">{project.name}</span>
                      {/* Available actions dots */}
                      <div className="flex gap-1">
                        {project.cmd_cms && <span className="h-1.5 w-1.5 rounded-full bg-red-400" title="CMS" />}
                        {project.cmd_deploy_master && (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" title="Master" />
                        )}
                        {project.cmd_deploy_develop && (
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" title="Develop" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
        {ACTION_DEFS.map(({ action, label, icon, variant, className }) => (
          <Button
            key={action}
            variant={variant}
            size="sm"
            disabled={pending !== null || selectedCount === 0}
            className={`gap-1.5 text-xs ${className ?? ''}`}
            onClick={() => handleBulkAction(action, label)}
          >
            {icon}
            {pending === action ? 'Sending...' : label}
          </Button>
        ))}
      </div>
    </div>
  );
}
