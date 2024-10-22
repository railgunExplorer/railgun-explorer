import React from "react";

interface LoadingModalProps {
  progress: number;
  message: string;
  subMessage: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  progress,
  message,
  subMessage,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <div className="inline-block relative">
          <div className="w-24 h-24 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-2xl font-bold text-blue-500">
              {progress}%
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6 mb-2">
          {message}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
