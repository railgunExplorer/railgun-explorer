import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { WalletHistoryProvider } from "./context/wallet-history.context";
import Layout from "./components/Layout/Layout";
import SearchScreen from "./screens/search.screen";
import SearchResultScreen from "./screens/search-result.screen";
import TransactionDetailsScreen from "./screens/transaction-details.screen";
import ViewingKeyHandler from "./components/ViewingKeyHandler";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Layout />
        <ViewingKeyHandler />
      </>
    ),
    children: [
      { index: true, element: <SearchScreen /> },
      { path: "/search-result", element: <SearchResultScreen /> },
      { path: "/transaction/:txId", element: <TransactionDetailsScreen /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <WalletHistoryProvider>
      <RouterProvider router={router} />
    </WalletHistoryProvider>
  );
};

export default App;
