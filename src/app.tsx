import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { WalletHistoryProvider } from "./context/wallet-history.context";
import { ChainSelectorProvider } from "./context/chain-selector.context";
import { RailgunConfigurationsProvider } from "./context/railgun-configurations.context";
import Layout from "./components/Layout/Layout";
import SearchScreen from "./screens/search.screen";
import SearchResultScreen from "./screens/search-result.screen";
import TransactionDetailsScreen from "./screens/transaction-details.screen";
import ViewingKeyHandler from "./components/ViewingKeyHandler";

const App: React.FC = () => {
  return (
    <RailgunConfigurationsProvider>
      <ChainSelectorProvider>
        <WalletHistoryProvider>
          <Layout />
          <ViewingKeyHandler />
        </WalletHistoryProvider>
      </ChainSelectorProvider>
    </RailgunConfigurationsProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SearchScreen /> },
      { path: "/search-result", element: <SearchResultScreen /> },
      { path: "/transaction/:txId", element: <TransactionDetailsScreen /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default () => <RouterProvider router={router} />;
