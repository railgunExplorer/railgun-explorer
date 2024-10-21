import React from "react";

interface AddressInfoProps {
  address: string;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ address }) => {
  const truncateMiddle = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str;
    const midPoint = Math.floor(maxLength / 2);
    return `${str.slice(0, midPoint)}...${str.slice(-midPoint)}`;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Address</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          <span className="hidden lg:inline">{address}</span>
          <span className="lg:hidden">{truncateMiddle(address, 30)}</span>
        </p>
      </div>
    </div>
  );
};

export default AddressInfo;
