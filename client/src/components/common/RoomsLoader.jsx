import React from "react";

const RoomsLoader = () => {
  return (
    <div className="border border-gray-300 shadow rounded-md p-4 w-full  mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-400 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-gray-400 rounded"></div>
          <div className="space-y-3">
            <div className="h-2 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsLoader;
