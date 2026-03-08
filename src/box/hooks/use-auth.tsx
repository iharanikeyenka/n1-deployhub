import { useEffect, useState } from 'react';

import { supabase } from '@/box';
import { Session } from '@supabase/supabase-js';

interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signInWithSlack: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithSlack = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: 'slack_oidc',
      options: { scopes: 'openid profile email' },
    });
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return { session, loading, signInWithSlack, signOut };
}
