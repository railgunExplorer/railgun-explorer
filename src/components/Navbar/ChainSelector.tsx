import React from "react";
import { useChainSelectorContext } from "../../context/chain-selector.context";
import { NetworkName } from "@railgun-community/shared-models";

const getNetworkImage = (network: NetworkName) => {
  switch (network) {
    case NetworkName.Ethereum:
      return "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1595348880";
    case NetworkName.Arbitrum:
      return "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242";
    case NetworkName.BNBChain:
      return "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1644979850";
    case NetworkName.Polygon:
      return "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745";
  }
};

const ChainSelector: React.FC = () => {
  const { selectedNetwork, options, changeSelectNetwork } =
    useChainSelectorContext();

  return (
    <div className="ml-4 relative">
      <select
        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm appearance-none"
        value={selectedNetwork}
        onChange={(e) => changeSelectNetwork(e.target.value as NetworkName)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <img
          src={getNetworkImage(selectedNetwork)}
          alt={selectedNetwork}
          width={20}
          height={20}
        />
      </div>
    </div>
  );
};

export default ChainSelector;
