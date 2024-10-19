import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import ChainSelector from "./ChainSelector";

interface NavbarProps {
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showSearch = true }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Railgun Explorer
              </span>
              <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Beta
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            {false && <ChainSelector />}
            {false && showSearch && <SearchInput />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
