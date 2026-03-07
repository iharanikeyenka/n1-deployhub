import { supabase } from "./supabase.ts";
import type { DeployAction } from "@/box/types/project.ts";

export async function sendSlackCommand(
  projectId: string,
  action: DeployAction,
): Promise<void> {
  const { error } = await supabase.functions.invoke("send-slack-message", {
    body: { project_id: projectId, action },
  });

  if (error) throw error;
}
