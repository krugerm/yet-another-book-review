import { useState } from "react";
import { supabase } from "./supabaseClient";
import React from "react";
import { YabrHeader } from "./components/YabrHeader";
import { YabrFooter } from "./components/YabrFooter";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <div className="row flex flex-center">
        <div className="col-6 form-widget">
          <p className="description">
            Sign in via magic link with your email below
          </p>
          <form className="form-widget" onSubmit={handleLogin}>
            <div>
              <input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button className={"button block"} disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <YabrFooter />
    </div>
  );
}
