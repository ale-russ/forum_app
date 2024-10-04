import React, { useState } from "react";
import { toast } from "react-toastify";

import { toastOptions } from "../utils/constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Loader from "../components/common/Loader";
import { requestPasswordReset } from "../controllers/AuthController";
export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Password reset email sent successfully", toastOptions);
    } catch (err) {
      toast.error("Oops! Something went wrong. Please try again", toastOptions);
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 light-navbar rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-[#FF571A]">
            Reset Password
          </h1>
          <form onSubmit={handlePasswordResetRequest}>
            <div>
              <label htmlFor="email">Email:</label>
              <Input
                className="light-search border-0 h-10 text-[#858EAD] outline-none w-full px-2"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
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
}
