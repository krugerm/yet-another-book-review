import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import type { IUserProfile } from '../types/iUserProfile';
import type { Database } from '../types/supabase';


export interface UserContextType {
  userProfile: IUserProfile | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = React.createContext<UserContextType | null>(null);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("UserProvider: onAuthStateChange", event, session);
      setSession(session);
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const getSession = async () => {
    return await supabase.auth.getSession().then(({ data: { session } }) => {
      // console.log("UserProvider: getSession", session);
      return session;
    });
  };
  
  let ignore = false;
  const fetchUserProfile = async() => {
    // console.log("fetchUserProfile: session", session);
    const session2 = await getSession();
    if (!session2) {
      return;
    }

    try {
      setLoading(true);
      // console.log("fetchUserProfile: session", session2);
      const { user } = session2;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select<'*', IUserProfile>('*')
        .eq("id", user.id)
        .single();

      // console.log("fetchUserProfile: profile", profile);

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (profile) {
          setUserProfile(profile);
        }
      }

      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };


  const value: UserContextType = {
    userProfile: userProfile,
    loading,
    fetchUserProfile, // Expose this method to allow manual refresh if needed
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => useContext(UserContext);