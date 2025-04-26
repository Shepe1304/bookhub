import { Link, useLocation } from "react-router-dom";
import {
  FaBook,
  FaPlus,
  FaHome,
  FaInfoCircle,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import { ProfileMenu } from "./Auth";

const Navbar = ({ user }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome /> },
    { to: "/book-explorer", text: "Book Explorer", icon: <FaSearch /> },
    { to: "/about", text: "About", icon: <FaInfoCircle /> },
  ];

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <FaBook className="text-2xl" />
            <span>Shepe's BookHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-20">
            <div className="flex space-x-6 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded transition hover:bg-blue-700 ${
                    location.pathname === link.to ? "bg-blue-700" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/create-post"
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <FaPlus />
                    <span>New Post</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  <ProfileMenu user={user} />
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700 ${
                  location.pathname === link.to ? "bg-blue-700" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-blue-700">
              {user ? (
                <>
                  <Link
                    to="/create-post"
                    className="flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaPlus />
                    <span>New Post</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left rounded transition hover:bg-blue-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-4 py-2 rounded transition hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
