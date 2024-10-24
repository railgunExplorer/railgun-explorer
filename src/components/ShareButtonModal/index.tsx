import React, { useState } from "react";
import { useShareLinkUrl } from "../../hooks/share-link.hook";
import { truncateMiddle } from "../../utils/string";

const ShareButtonModal: React.FC = () => {
  const link = useShareLinkUrl();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    handleClose();
  };

  const truncatedLink = truncateMiddle(link, 100); // Adjust the length as needed

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-0.5 sm:p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
        aria-label="Share"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          fill="currentColor"
          className="h-3 w-3 sm:h-4 sm:w-4"
          viewBox="0 0 481.6 481.6"
        >
          <path d="M381.6,309.4c-27.7,0-52.4,13.2-68.2,33.6l-132.3-73.9c3.1-8.9,4.8-18.5,4.8-28.4c0-10-1.7-19.5-4.9-28.5l132.2-73.8   c15.7,20.5,40.5,33.8,68.3,33.8c47.4,0,86.1-38.6,86.1-86.1S429,0,381.5,0s-86.1,38.6-86.1,86.1c0,10,1.7,19.6,4.9,28.5   l-132.1,73.8c-15.7-20.6-40.5-33.8-68.3-33.8c-47.4,0-86.1,38.6-86.1,86.1s38.7,86.1,86.2,86.1c27.8,0,52.6-13.3,68.4-33.9   l132.2,73.9c-3.2,9-5,18.7-5,28.7c0,47.4,38.6,86.1,86.1,86.1s86.1-38.6,86.1-86.1S429.1,309.4,381.6,309.4z M381.6,27.1   c32.6,0,59.1,26.5,59.1,59.1s-26.5,59.1-59.1,59.1s-59.1-26.5-59.1-59.1S349.1,27.1,381.6,27.1z M100,299.8   c-32.6,0-59.1-26.5-59.1-59.1s26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1S132.5,299.8,100,299.8z M381.6,454.5   c-32.6,0-59.1-26.5-59.1-59.1c0-32.6,26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1C440.7,428,414.2,454.5,381.6,454.5z" />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              &#x2715;
            </button>
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
                Sensitive Link
              </h2>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-normal text-gray-600">
                This link contains private information. Sharing and/or using
                this reveal all the history of transaction for this wallet and
                can be revoked.
              </p>
              <div className="flex justify-center mb-3 sm:mb-4">
                <textarea
                  readOnly
                  value={truncatedLink}
                  title={link}
                  className="w-full p-1 sm:p-2 bg-gray-100 rounded text-xs sm:text-sm text-gray-500 border border-gray-300 text-center resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition duration-300 ease-in-out font-medium text-xs sm:text-sm"
              >
                I understand, copy the link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButtonModal;
