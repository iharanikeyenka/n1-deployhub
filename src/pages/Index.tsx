import { useAuth } from '@/box';

import { LoginScreen } from '@/components/molecules/LoginScreen';
import { Dashboard } from '@/components/templates/Dashboard';

const Index = () => {
  const { session, loading, signInWithSlack, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSignIn={signInWithSlack} />;
  }

  return <Dashboard session={session} onSignOut={signOut} />;
};

export default Index;
