import axios from "axios";
import { adminDashboardRoute } from "../utils/ApiRoutes";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/constants";

export const getAdminDashboard = async ({ token, role }) => {
  if (role === "user") return;

  try {
    const { data } = await axios.get(`${adminDashboardRoute}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err) {
    toast.error("Oops! Something went wrong. Please try again", toastOptions);
  }
};
