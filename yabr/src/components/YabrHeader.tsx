import React from "react";
import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  TextInput,
  Avatar,
  Dropdown,
  Button,
} from "flowbite-react";
import { HiSearch, HiUserCircle } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from '../UserContext';
import type { IUserProfile } from '../types/iUserProfile';
import { supabase } from "../supabaseClient";
import { useTranslation } from "react-i18next";
import { addAiGeneratedReviewsForAllBooks } from "../utils/generateAiReviews";

export const YabrHeader: React.FC<{initSearchTerm?: string, showSearchBar?: boolean}> = ({ initSearchTerm, showSearchBar}) => {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setSearchTerm(initSearchTerm ?? '');
  }, [initSearchTerm]);

  if (!userContext) {
    return null;
  }
  const { userProfile, loading } = userContext;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleGenerateAiReviewsForAllBooks = async () => {
    await addAiGeneratedReviewsForAllBooks();
  };

  return (
    <Navbar
      fluid
      className="px-4 py-4 bg-white dark:bg-gray-800 w-full"
    >
      <div className="flex justify-between items-center w-full">
        <NavbarBrand onClick={() => navigate('/')} className="flex items-center">
          <img
            src="/assets/favicon-32x32.png"
            className="mr-3 h-6 sm:h-9"
            alt="Yet Another Book Review Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-gray-700">
            Yet Another Book Review
          </span>
        </NavbarBrand>

        <div className="hidden md:flex items-center flex-grow justify-end">

          {loading || userContext.loading ? (
            <>
              <div className="hidden" id="user-loading"/>
              <div id="user-profile-loading"></div>
            </>
          ) : !userProfile ? (
            <>
              <div className="hidden" id="user-logged-out"></div>
              <Button className="btn bg-blue-700" onClick={() => navigate("/login")}>
                Login to create a review
              </Button>
            </>
          ) : (
            <>
              <div className="hidden" id="user-logged-in"></div>
              <Button className="btn bg-blue-700 mx-4" onClick={() => navigate("/create-book-review")}>
                Create a review
              </Button>

              <Dropdown
                arrowIcon={false}
                inline
                label={
                  userProfile.avatar_url ? 
                  <img id="user-profile-image" src={userProfile.avatar_url ?? '/assets/placeholder1.png'} alt={userProfile.full_name ?? userProfile.username ?? 'User'} className="w-12 h-12 rounded-full object-cover" />
                  :
                  <HiUserCircle size={32} />
                }
              >
                <Dropdown.Header className="text-left">
                  <span className="block text-sm font-bold">
                    {userProfile.full_name ?? userProfile.username}
                  </span>
                  {/* <span className="block truncate text-sm font-medium">
                  {userProfile.username ?? "unknown"}
                  </span> */}
                </Dropdown.Header>
                <Dropdown.Item onClick={() => handleGenerateAiReviewsForAllBooks()}>Generate AI Reviews</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item id="btn-logout" onClick={handleLogout}>Sign out</Dropdown.Item>
              </Dropdown>
            </>
          )}
        </div>
      </div>


      <div className="md:hidden mt-4 w-full">
        
        <div className="flex items-center flex-grow justify-end sm:justify-between">
          {loading || userContext.loading ? (
            <div>Loading...</div>
          ) : !userProfile ? (
            <Button className="btn bg-blue-700" onClick={() => navigate("/login")}>
              Login to create a review
            </Button>
          ) : (
            <>
              <Button className="btn bg-blue-700 mx-4" onClick={() => navigate("/create-book-review")}>
                Create a review
              </Button>

              <Dropdown
                key="user-profile-dropdown"
                arrowIcon={false}
                inline
                label={
                  userProfile.avatar_url ? 
                  <img src={userProfile.avatar_url ?? '/assets/placeholder1.png'} alt={userProfile.full_name ?? userProfile.username ?? 'User'} className="w-12 h-12 rounded-full object-cover" />
                  :
                  <HiUserCircle size={32} />
                }
              >
                <Dropdown.Header className="text-left">
                  <span className="block text-sm font-bold">
                    {userProfile.full_name ?? userProfile.username}
                  </span>
                  {/* <span className="block truncate text-sm font-medium">
                  {userProfile.username ?? "unknown"}
                  </span> */}
                </Dropdown.Header>
                <Dropdown.Item onClick={() => handleGenerateAiReviewsForAllBooks()}>Generate AI Reviews</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item id="btn-logout2" onClick={handleLogout}>Sign out</Dropdown.Item>
              </Dropdown>
            </>
          )}
        </div>

      </div>
    </Navbar>
  );
};