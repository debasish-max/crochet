import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role:', error.message);
        setRole('user'); 
      } else {
        setRole(data?.role || 'user');
      }
    } catch (err) {
      console.error('Error in fetchRole:', err);
      setRole('user');
    }
  };

  const [initialized, setInitialized] = useState(false);

  // 1. Listen for auth changes - ONLY update the user object
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setInitialized(true);
      
      // If we sign out or have no session, clear everything immediately
      if (!session) {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. React to user changes by fetching the role
  useEffect(() => {
    if (!initialized) return; // Don't do anything until we've checked for an initial session

    if (!user) {
      setLoading(false);
      return;
    }

    // If we have a user, fetch their role
    setLoading(true);
    fetchRole(user.id).finally(() => {
      setLoading(false);
    });
  }, [user?.id, initialized]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
