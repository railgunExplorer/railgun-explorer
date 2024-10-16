import React, { useEffect } from "react";
import { useWalletHistoryContext } from "../context/wallet-history.context";
import { useNavigate } from "react-router-dom";

const LoadingScreen: React.FC = () => {
  const { progress, isLoading } = useWalletHistoryContext();
  const navigate = useNavigate();

  const formattedProgress = progress === 0 ? 100 : Math.round(progress * 100);

  useEffect(() => {
    if (progress === 0 && !isLoading) {
      navigate("/search-result");
    }
  }, [progress, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block relative">
          <div className="w-24 h-24 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-2xl font-bold text-primary">
              {formattedProgress}%
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-2">
          Decrypting your wallet
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we load your wallet details...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
