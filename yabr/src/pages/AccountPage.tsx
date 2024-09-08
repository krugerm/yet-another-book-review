import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "../components/Avatar";
import React from "react";
import { Session } from "@supabase/supabase-js";
import { useUserContext } from '../contexts/UserContext';
import { useAlert } from '../contexts/AlertContext';
import { useNavigate } from "react-router-dom";


export const AccountPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  useEffect(() => {
    loadProfile();
  }, [session]);

  async function loadProfile() {
    setLoading(true);

    const userContext = useUserContext();
    const { userProfile } = userContext!;

    if (!userProfile) {
      return;
    }
    setFullName(userProfile.full_name ?? '');
    setAvatarUrl(userProfile.avatar_url ?? '');

    setLoading(false);
  }

  async function updateProfile(event) {
    event.preventDefault();

    try {
      setLoading(true);

      const userContext = useUserContext();
      const { userProfile } = userContext!;
  
      if (!userProfile) {
        return;
      }
  
      const { error } = await supabase
        .from("profiles")
        .update({full_name: fullName, avatar_url: avatarUrl})
        .eq("id", userProfile.id);
  
      if (error) {
        throw error;
      }

      await loadProfile();
    }
    catch (error) {
      showAlert(error.message, 'error');
    }
    finally {
      setLoading(false);
    }
    
  }

  return (
    <form onSubmit={(event) => updateProfile(event)} className="form-widget">
      <Avatar
        url={avatarUrl}
        size={150}
        onUpload={(event, avatar_url) => {
          setAvatarUrl(avatar_url);
          updateProfile(event);
        }}
      />
      <div>
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          type="text"
          value={fullName || ""}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          type="button"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </form>
  );
}

export default AccountPage;