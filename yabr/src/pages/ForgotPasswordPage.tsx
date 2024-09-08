import React, { useState, useEffect } from "react";
import { YabrHeader } from "../components/YabrHeader";
import { YabrFooter } from "../components/YabrFooter";
import { Button } from "flowbite-react";
import { useUserContext } from '../contexts/UserContext';
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAlert } from '../contexts/AlertContext';


const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (userContext?.userProfile) {
      navigate('/');
      return;
    }
  }, [userContext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending password reset email to:', email);
    try {
      const hostname = window.location.hostname;
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `https://${hostname}/resetPassword` });
      // await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://yet-another-book-review.vercel.app/resetPassword' });
    } catch (error) {
      showAlert("Could not send password reset email: " + (error.error_description || error.message || JSON.stringify(error)), 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <YabrHeader />

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center px-6 mx-auto md:h-screen py-12">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your password?
            </h1>
            <p className="font-light text-gray-500 dark:text-gray-400">
              Don't fret! Just type in your email and we will send you a code to
              reset your password!
            </p>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@yarb.com"
                  required
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We will send you an email with a link to reset your password.
                </p>
              </div>

              <Button
                type="submit"
                onClick={(e) => {handleSubmit(e)}}
                className="bg-blue-700 w-full text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Reset password
              </Button>
            </form>
          </div>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default ForgotPasswordPage;
