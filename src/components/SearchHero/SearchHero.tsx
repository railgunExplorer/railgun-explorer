import React from "react";
import { useNavigate } from "react-router-dom";
import { useMetamaskWallet } from "../../context/metamask-wallet.context";

interface SearchHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchHero: React.FC<SearchHeroProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const navigate = useNavigate();
  const { account } = useMetamaskWallet();

  return (
    <div className="text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl max-w-2xl mx-auto">
        <span className="block xl:inline">Explore the</span>{" "}
        <span className="block text-indigo-600 xl:inline">
          Railgun Contract
        </span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Decript your Railgun transactions and balances from you viewing keys.
      </p>
      <div className="mt-5 max-w-3xl mx-auto sm:flex sm:justify-center md:mt-8">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter viewing key / Txn Hash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* My Wallet Quick Link */}
      {account && (
        <div className="mt-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/my-wallet')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            View My Wallet Details
          </button>
        </div>
      )}

      <div className="mt-8 max-w-3xl mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
        <p className="text-sm">
          <strong>Warning:</strong> Railgun Explorer requires publishing private
          information about Railgun addresses. Only use this tool if you
          understand and accept that your transaction data may no longer be
          private. While Railgun Explorer commits to respecting your privacy and
          not storing data, exercise caution when relying on such assurances.
        </p>
      </div>
    </div>
  );
};

export default SearchHero;
