import React, { useEffect, useState } from "react";
import { useWalletHistoryContext } from "../../context/wallet-history.context";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import { useConsumeQueryParam } from "../../hooks/useConsumeQueryParam";

const ViewingKeyHandler: React.FC = () => {
  const { handleQueryWalletBalance, isLoading, isInitialized, progress } =
    useWalletHistoryContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const viewingKeyParam = useConsumeQueryParam("viewingKey");

  const handleViewingKey = async (viewingKey: string) => {
    await handleQueryWalletBalance(viewingKey);

    if (location.pathname === "/") {
      navigate("/search-result");
    }
  };

  useEffect(() => {
    if (viewingKeyParam) {
      handleViewingKey(viewingKeyParam);
    }
  }, [viewingKeyParam]);

  useEffect(() => {
    if (isLoading) {
      setShowLoadingModal(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoadingModal(false);
      }, 2 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const formattedProgress =
    isInitialized && !isLoading && progress === 0
      ? 100
      : Math.round(progress * 100);

  return showLoadingModal ? (
    <LoadingModal
      progress={formattedProgress}
      message="Loading Wallet History"
      subMessage="Please wait while we fetch your wallet history"
    />
  ) : null;
};

export default ViewingKeyHandler;
