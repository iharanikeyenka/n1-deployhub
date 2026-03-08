import { type Project, supabase } from '@/box';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');

  if (error) throw new Error(error.message);
  return data ?? [];
}
