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
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../UserContext';
import type { IUserProfile } from '../types/iUserProfile';

export function YabrHeader() {
  const navigate = useNavigate();
  const userContext = useUserContext();

  if (!userContext) {
    return null; // or handle the null case appropriately
  }

  const { userProfile, loading } = userContext;

  return (
    <Navbar
      fluid
      className="px-4 py-2 bg-white dark:bg-gray-800 shadow-md w-full"
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
          <div className="hidden md:block flex-grow max-w-md mr-4">
            <form>
              <TextInput
                id="searchText1"
                type="text"
                icon={HiSearch}
                placeholder="Search books..."
                required
                className="w-full"
              />
            </form>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : !userProfile ? (
            <Button className="btn bg-primary-700" onClick={() => navigate("/login")}>
              Login
            </Button>
          ) : (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={userProfile.avatar_url ?? "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                  rounded
                />
              }
            >
              <p>{userProfile.avatar_url ?? "testing"}</p>
              <Dropdown.Header className="text-left">
                <span className="block text-sm">
                  {userProfile.username ?? userProfile.username}
                </span>
                {/* <span className="block truncate text-sm font-medium">
                {userProfile.username ?? "unknown"}
                </span> */}
              </Dropdown.Header>
              <Dropdown.Item>Your Reviews</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="md:hidden mt-4 w-full">
        <form>
          <TextInput
            id="searchText2"
            type="text"
            icon={HiSearch}
            placeholder="Search books..."
            required
            className="w-full"
          />
        </form>
      </div>
    </Navbar>
  );
}
