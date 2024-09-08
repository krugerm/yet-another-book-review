import React, { useState, useEffect } from "react";
import { YabrHeader } from "../components/YabrHeader";
import { YabrFooter } from "../components/YabrFooter";
import { Button } from "flowbite-react";
import { useUserContext } from '../contexts/UserContext';
import { useAlert } from '../contexts/AlertContext';
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";


const RegisterPage = () => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [passwordComplexityMessage, setPasswordComplexityMessage] = useState('');

  const { next } = useParams();

  useEffect(() => {
    if (userContext?.userProfile) {
      navigate('/');
      return;
    }
  }, [userContext]);

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

    setLoading(true);
    setError(null);

    try {
      showAlert("Signing you up...", 'info');

      const { data, error } = await supabase.auth.signUp({email: email, password: password});
      if (error) {
        throw error;
      }

      showAlert("Please check your email to confirm your email address.", "success");
      
      navigate('/login');
    } catch (error) {
      //showAlert("An error occurred. Please try again later.\n" + JSON.stringify(error), "error");
      showAlert("An error occurred. Please try again later.", "error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md">
      <YabrHeader />

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center px-6 py-12 mx-auto md:h-screen lg:py-12">

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign Up
              </h1>
              <form className="space-y-4 md:space-y-6" action="#" onSubmit={(e) => handleSubmit(e)}>
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
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {passwordComplexityMessage && (
                    <p className="text-red-500 text-sm">{passwordComplexityMessage}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password confirmation
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div> */}
                  <a
                    onClick={() => navigate('/forgotPassword')}
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>

                {validationMessage && (
                  <p className="text-red-500 text-sm">{validationMessage}</p>
                )}
                <Button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-900 w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign Up
                </Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    onClick={() => navigate('/login')}
                    href="#"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <YabrFooter />
    </div>
  );
};

export default RegisterPage;
