import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

function AuthWrapper() {
  return (
    <div>
      <>
        <Outlet />
      </>
    </div>
  );
}

export default AuthWrapper;
