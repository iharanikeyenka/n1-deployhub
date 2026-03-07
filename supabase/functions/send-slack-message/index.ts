import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { project_id, action } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: project, error } = await supabase
      .from("projects")
      .select("name, cmd_cms, cmd_deploy_master, cmd_deploy_develop")
      .eq("id", project_id)
      .single();

    if (error || !project) throw new Error("Project not found");

    const messages: string[] = [];

    if (action === "full_deploy") {
      if (project.cmd_cms) messages.push(project.cmd_cms);
      if (project.cmd_deploy_master) messages.push(project.cmd_deploy_master);
    } else if (action === "cms") {
      if (project.cmd_cms) messages.push(project.cmd_cms);
    } else if (action === "deploy_master") {
      if (project.cmd_deploy_master) messages.push(project.cmd_deploy_master);
    } else if (action === "deploy_develop") {
      if (project.cmd_deploy_develop) messages.push(project.cmd_deploy_develop);
    }

    const userToken = Deno.env.get("SLACK_USER_TOKEN")!;
    const channelId = Deno.env.get("SLACK_CHANNEL_ID")!;

    for (const text of messages) {
      const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: channelId,
          text,
          as_user: true,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(`Slack error: ${data.error}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
