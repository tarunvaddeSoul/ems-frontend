export const convertToCustomDateFormat = (date: Date | string | number) => {
  // If the input is already a string in DD-MM-YYYY format, return it as is
  if (typeof date === "string" && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return date;
  }

  // Convert to Date object if it's not already
  const dateObject = new Date(date);

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    throw new Error("Invalid date");
  }

  // Get day, month, and year
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = dateObject.getFullYear();

  // Return the formatted date
  return `${day}-${month}-${year}`;
};


export const parseDateString = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
};

export const formatDateToString = (date: Date | null): string | null => {
  if (!date) return null;
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};