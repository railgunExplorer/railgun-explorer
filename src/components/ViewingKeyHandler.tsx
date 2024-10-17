import React, { useEffect } from "react";
import { useQueryParams } from "./QueryParamHandler";
import { useWalletHistoryContext } from "../context/wallet-history.context";
import { useNavigate, useLocation } from "react-router-dom";

interface ViewingKeyHandlerProps {
  children: React.ReactNode;
}

const ViewingKeyHandler: React.FC<ViewingKeyHandlerProps> = ({ children }) => {
  const queryParams = useQueryParams();
  const { handleQueryWalletBalance } = useWalletHistoryContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (queryParams.viewingKey) {
      handleQueryWalletBalance(queryParams.viewingKey)
        .then(() => {
          if (location.pathname === "/") {
            navigate("/search-result");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [
    queryParams.viewingKey,
    handleQueryWalletBalance,
    navigate,
    location.pathname,
  ]);

  return <>{children}</>;
};

export default ViewingKeyHandler;
