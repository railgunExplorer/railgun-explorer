import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WalletHistoryProvider } from "./context/wallet-history.context";
import Layout from "./components/Layout/Layout";
import SearchScreen from "./screens/search.screen";
import SearchResultScreen from "./screens/search-result.screen";
import TransactionDetailsScreen from "./screens/transaction-details.screen";
import QueryParamHandler from "./components/QueryParamHandler";
import ViewingKeyHandler from "./components/ViewingKeyHandler";

const App: React.FC = () => {
  return (
    <Router>
      <WalletHistoryProvider>
        <QueryParamHandler>
          <ViewingKeyHandler>
            <Layout>
              <Routes>
                <Route path="/" element={<SearchScreen />} />
                <Route path="/search-result" element={<SearchResultScreen />} />
                <Route
                  path="/transaction/:txId"
                  element={<TransactionDetailsScreen />}
                />
              </Routes>
            </Layout>
          </ViewingKeyHandler>
        </QueryParamHandler>
      </WalletHistoryProvider>
    </Router>
  );
};

export default App;
