import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../api/firebase";

const NavBar = ({ setActiveSession, activeSession, setSearch }) => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  const currentUserImg = currentUser?.photoURL;
  const navigate = useNavigate();
  const [mobileNavBtn, setMobileNavBtn] = useState(false);
  const [profileBtn, setProfileBtn] = useState(false);

  const mobileNavBtnClick = () => {
    setMobileNavBtn(!mobileNavBtn);
  };

  const profileBtnClick = () => {
    setProfileBtn(!profileBtn);
  };

  const signOutBtnClick = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      alert(error.message);
    }
  };

  const privateChatBtn = () => {
    setActiveSession(true);
    setMobileNavBtn(false); // Close the mobile menu
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update search state
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={mobileNavBtnClick}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={mobileNavBtn}
            >
              <span className="sr-only">Open main menu</span>
              {mobileNavBtn ? (
                <svg
                  className="block h-6 w-6 transform transition-transform duration-300 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6 transform transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>

            {/* Desktop menu buttons */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 items-center">
                <button
                  onClick={privateChatBtn}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    activeSession
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-current={activeSession ? "page" : undefined}
                >
                  Private Chat
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearchChange}
                  className="rounded-md px-3 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>

            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  onClick={profileBtnClick}
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={profileBtn}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUserImg || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt="User Profile"
                  />
                </button>
              </div>

              {profileBtn && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <button
                    onClick={signOutBtnClick}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu buttons */}
      {mobileNavBtn && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <button
              onClick={() => {
                setActiveSession(true);
                setMobileNavBtn(false); // Close the mobile menu
              }}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                activeSession
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              aria-current={activeSession ? "page" : undefined}
            >
              Private Chat
            </button>
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="rounded-md px-3 py-1 text-sm w-full mx-1"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
