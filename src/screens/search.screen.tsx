import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHero from "../components/SearchHero/SearchHero";
import { useWalletHistoryContext } from "../context/wallet-history.context";

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { handleQueryWalletBalance } = useWalletHistoryContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    handleQueryWalletBalance(searchQuery);
    navigate(`/loading`);
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SearchHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchScreen;
