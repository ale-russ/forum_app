import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";

function AuthWrapper() {
  return (
    <div className="h-full w-full light-search">
      <>
        <Outlet />
        <Footer />
      </>
    </div>
  );
}

export default AuthWrapper;
