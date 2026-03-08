// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — Deno runtime, Node/TS LSP doesn't support it yet
import { DeployAction, Project } from '@/box';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  project_id: string;
  action: DeployAction;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { project_id, action } = (await req.json()) as RequestBody;

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: project, error } = await supabase
      .from('projects')
      .select('name, cmd_cms, cmd_deploy_master, cmd_deploy_develop')
      .eq('id', project_id)
      .single<Project>();

    if (error || !project) throw new Error('Project not found');

    const messages: string[] = [];

    if (action === 'full_deploy') {
      if (project.cmd_cms) messages.push(project.cmd_cms);
    } else if (action === 'cms') {
      if (project.cmd_cms) messages.push(project.cmd_cms);
    } else if (action === 'deploy_master') {
      if (project.cmd_deploy_master) messages.push(project.cmd_deploy_master);
    } else if (action === 'deploy_develop') {
      if (project.cmd_deploy_develop) messages.push(project.cmd_deploy_develop);
    }

    const userToken = Deno.env.get('SLACK_USER_TOKEN')!;
    const channelId = Deno.env.get('SLACK_CHANNEL_ID')!;

    for (const text of messages) {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: channelId, text, as_user: true }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(`Slack error: ${data.error}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
