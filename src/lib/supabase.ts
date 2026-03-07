import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utpwxmvnmrsjkliccddc.supabase.co';
const supabaseAnonKey = 'sb_publishable_ohWU3igr9OmIpIyWVUVJhQ_ARxNmNWg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
