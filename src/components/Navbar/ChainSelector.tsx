import React from "react";
import { useChainSelectorContext } from "../../context/chain-selector.context";
import { SupportedNetworks } from "../../models/supported-networks";
const ChainSelector: React.FC = () => {
  const { selectedNetwork, options, changeSelectNetwork } =
    useChainSelectorContext();

  return (
    <div className="ml-4">
      <select
        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        value={selectedNetwork}
        onChange={(e) =>
          changeSelectNetwork(e.target.value as SupportedNetworks)
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChainSelector;
