export const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `Today at ${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    const options = { weekday: "long" };
    return date.toLocaleDateString(undefined, options);
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};
