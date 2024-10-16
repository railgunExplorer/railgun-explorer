import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WalletHistoryProvider } from "./context/wallet-history.context";
import Layout from "./components/Layout/Layout";
import SearchScreen from "./screens/search.screen";
import SearchResultScreen from "./screens/search-result.screen";
import LoadingScreen from "./screens/loading.screen";
import TransactionDetailsScreen from "./screens/transaction-details.screen";

const App: React.FC = () => {
  return (
    <Router>
      <WalletHistoryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<SearchScreen />} />
            <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/search-result" element={<SearchResultScreen />} />
            <Route
              path="/transaction/:txId"
              element={<TransactionDetailsScreen />}
            />
          </Routes>
        </Layout>
      </WalletHistoryProvider>
    </Router>
  );
};

export default App;
