import React, { useEffect, useState } from "react";
import { YabrHeader } from "../components/YabrHeader";
import { YabrFooter } from "../components/YabrFooter";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAlert } from '../contexts/AlertContext';
import { Session } from "@supabase/supabase-js";
import { AiOutlineLoading } from "react-icons/ai";


const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [passwordComplexityMessage, setPasswordComplexityMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })

    return () => subscription.unsubscribe();
  }, [])

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePasswordComplexity(e.target.value);
  };

  const validatePasswords = () => {
    if (password !== password2) {
      setValidationMessage('Passwords do not match');
      return false;
    }
    setValidationMessage('');
    return true;
  };
  
  const validatePasswordComplexity = (password) => {
    const complexityCriteria = [
      { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
      { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
      { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
      { regex: /[0-9]/, message: 'Password must contain at least one number' },
      { regex: /[^A-Za-z0-9]/, message: 'Password must contain at least one special character' },
    ];
  
    for (const criterion of complexityCriteria) {
      if (!criterion.regex.test(password)) {
        setPasswordComplexityMessage(criterion.message);
        return false;
      }
    }
  
    setPasswordComplexityMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswords() || !validatePasswordComplexity(password)) {
      return;
    }


    try {
      setLoading(true);
      setError(null);

      await supabase.auth.updateUser({ password: password });
      showAlert("Your password has been reset.", 'success');

      navigate('/login');
    } 
    catch (error) {
      showAlert("Could not reset your password: " + (error.error_description || error.message || JSON.stringify(error)), 'error');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center px-6 py-12 mx-auto md:h-screen">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e)}
                  placeholder=""
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                {passwordComplexityMessage && (
                  <p className="text-red-500 text-sm">{passwordComplexityMessage}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder=""
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              {validationMessage && (
                  <p className="text-red-500 text-sm">{validationMessage}</p>
                )}
              <Button
                onClick={(e) => {handleSubmit(e)}}
                type="submit"
                disabled={loading}
                className="bg-blue-700 w-full text-white hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loading && <AiOutlineLoading className="animate-spin mr-2 h-5 w-5" />}
                {loading ? 'Resetting password...' : 'Reset password'}                
              </Button>
            </form>
          </div>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default ResetPasswordPage;
