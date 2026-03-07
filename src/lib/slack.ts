import { supabase } from "./supabase";

export async function sendSlackCommand(projectId: string, action: string) {
  const { data, error } = await supabase.functions.invoke(
    "send-slack-message",
    {
      body: { project_id: projectId, action },
    },
  );

  if (error) throw error;
  return data;
}
