import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient, type Session } from '@supabase/supabase-js';
import { createContext, useEffect, useMemo, useState } from 'react';
import './App.css';
import { AppContent } from './components/AppContent';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SessionContext = createContext<Session | null>(null);

export const App = () =>  {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {        
      setSession(session);
    });

    const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => { 
      setSession(session);   
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => (session ?? null), [session]);

  return (
    <div>
      {session &&
        <SessionContext.Provider value={value}>
          <AppContent />
        </SessionContext.Provider>
      }
      {!session && 
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={['google']}
        />
      }
    </div>
  );
};

