import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithSlack = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'slack_oidc' as any,
      options: {
        scopes: 'openid profile email',
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, signInWithSlack, signOut };
}
