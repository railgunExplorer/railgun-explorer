import React from "react";

const ChainSelector: React.FC = () => {
  return (
    <div className="ml-4">
      <select className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
        <option>Ethereum</option>
        <option>Binance Smart Chain</option>
        <option>Polygon</option>
      </select>
    </div>
  );
};

export default ChainSelector;
