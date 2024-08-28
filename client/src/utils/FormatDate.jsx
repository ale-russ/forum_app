import format from "date-fns/format";
import { formatDistanceToNow, isValid } from "date-fns";

export const formatDate = (date) => {
  return !date ? " " : format(new Date(date), "MM-dd-yyyy HH:mm");
};

export const validDate = (date) => {
  return isValid(new Date(date))
    ? `${formatDistanceToNow(new Date(date))} ago`
    : "Just now";
};
