import React from "react";

function Loader() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-4 border-t-gray-500 animate-spin"></div>
    </div>
  );
}

export default Loader;
