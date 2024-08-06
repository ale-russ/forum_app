import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

function AuthWrapper() {
  return (
    <div className="h-full w-full">
      <>
        <Outlet />
      </>
    </div>
  );
}

export default AuthWrapper;
