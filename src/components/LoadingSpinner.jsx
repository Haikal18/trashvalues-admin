import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-t-green-500 border-r-transparent border-b-green-500 border-l-transparent rounded-full animate-spin"></div>
        <div
          className="absolute top-0 left-0 w-20 h-20 border-4 border-t-transparent border-r-green-300 border-b-transparent border-l-green-300 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1s" }}
        ></div>
        <div className="mt-4 text-center text-green-600 font-medium">
          Loading...
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
