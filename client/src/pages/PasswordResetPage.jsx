import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { toastOptions } from "../utils/constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { resetPassword } from "../controllers/AuthController";
import Loader from "../components/common/Loader";

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = new URLSearchParams(location.search).get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password !== confirmPassword) {
        toast.error(
          "password and confirm password should match. Pleas try again",
          toastOptions
        );
        return;
      }
      await resetPassword(password, token ?? "");
      toast.success(
        "Password changed successfully. Please login with the new password",
        toastOptions
      );
    } catch (err) {
      toast.error(
        "Oops! Error changing password. Please try again",
        toastOptions
      );
    } finally {
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md light-navbar">
          <h1 className="text-2xl font-bold text-center text-[#FF571A]">
            Missing or Invalid Token
          </h1>
          <p className="text-center">
            Please check your email for the password reset link and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 light-navbar rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-[#FF571A]">
            Password Reset
          </h1>
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col items-start justify-center px-4 gap-y-4 "
          >
            <div className="w-full">
              <label htmlFor="password">New Password:</label>
              <Input
                type="password"
                className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <Input
                type="password"
                className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              className="w-full rounded bg-[#FF571A] hover:bg-[#FF571A]/90  h-10 text-sm text-center px-3 my-2 shadow-lg text-white"
              disabled={isLoading}
            >
              SUBMIT
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PasswordResetPage;
