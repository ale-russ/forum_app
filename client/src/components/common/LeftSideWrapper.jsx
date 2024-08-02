import React from "react";

const LeftSideWrapper = ({ children }) => {
  return (
    <main className="flex flex-col items-start gap-4 space-x-1  m-3 min-h-48 w-64 rounded-lg dark-navbar pl-2 py-2 ">
      {children}
    </main>
  );
};

export default LeftSideWrapper;
