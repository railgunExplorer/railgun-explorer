import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHero from "../components/SearchHero/SearchHero";
import { useWalletHistoryContext } from "../context/wallet-history.context";

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { handleQueryWalletBalance } = useWalletHistoryContext();

  const handleSearch = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!searchQuery) return;
      await handleQueryWalletBalance(searchQuery);
      navigate(`/search-result`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="w-full max-w-3xl">
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
