import type { Project } from '@/box/types/project';
import { supabase } from '@/box/utils/supabase';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');

  if (error) throw new Error(error.message);
  return data ?? [];
}
