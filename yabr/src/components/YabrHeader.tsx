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
        <NavbarBrand href="/" className="flex items-center">
          <img
            src="/src/assets/favicon-32x32.png"
            className="mr-3 h-6 sm:h-9"
            alt="Yet Another Book Review Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-gray-700">
            Yet Another Book Review
          </span>
        </NavbarBrand>

        <div className="flex items-center flex-grow justify-end">

          {/* {(showSearchBar ?? true) && (
            <div className="hidden md:block flex-grow max-w-md mr-4">
              <form onSubmit={() => navigate('/search/' + searchTerm)}>
                <TextInput
                  id="searchText1"
                  type="text"
                  icon={HiSearch}
                  placeholder={t("Search reviewed books...")}
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </form>
            </div>
          )} */}

          <Button className="btn bg-blue-700 mx-4" onClick={() => navigate("/create-book-review")}>
            Create a review
          </Button>

          {loading ? (
            <div>Loading...</div>
          ) : !userProfile ? (
            <Button className="btn bg-blue-700" onClick={() => navigate("/login")}>
              Login
            </Button>
          ) : (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                userProfile.avatar_url ? 
                <img src={userProfile.avatar_url ?? '/src/assets/placeholder1.png'} alt={userProfile.full_name ?? userProfile.username ?? 'User'} className="w-12 h-12 rounded-full object-cover" />
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
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>

      {(showSearchBar ?? true) && (
      <div className="md:hidden mt-4 w-full">
        <form>
          <TextInput
            id="searchText2"
            type="text"
            icon={HiSearch}
            placeholder={t("Search reviewed books...")}
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </form>
      </div>)}
    </Navbar>
  );
};