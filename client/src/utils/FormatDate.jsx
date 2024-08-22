import format from "date-fns/format";

export const formatDate = (date) => {
  return !date ? " " : format(new Date(date), "MM-dd-yyyy HH:mm");
};
