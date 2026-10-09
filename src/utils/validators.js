

export const required = (value) =>
  value?.toString().trim()
    ? ""
    : "This field is required.";

export const isEmail = (value) =>
  /^\S+@\S+\.\S+$/.test(value ?? "")
    ? ""
    : "Enter a valid email address.";

export const maxLength = (limit) => (value) =>
  (value ?? "").toString().length <= limit
    ? ""
    : `Must be ${limit} characters or fewer.`;

export const minLength = (limit) => (value) =>
  (value ?? "").toString().length >= limit
    ? ""
    : `Must be at least ${limit} characters.`;

export const fileType = (
  allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ]
) => (file) => {
  if (!file) return "";

  return allowedTypes.includes(file.type)
    ? ""
    : "Only PDF, JPG, and PNG files are allowed.";
};

export const maxFileSize = (maxMB = 5) => (file) => {
  if (!file) return "";

  return file.size <= maxMB * 1024 * 1024
    ? ""
    : `File size must not exceed ${maxMB} MB.`;
};

export const noPastDate = (value) => {
  if (!value) return "";

  // Compare calendar dates in local time.
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    return "Enter a valid date.";
  }

  return selected >= today
    ? ""
    : "Please select today or a future date.";
};

export const dateWithinFutureLimit = (maxDays = 365) => (value) => {
  if (!value) return "";

  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    return "Enter a valid date.";
  }

  const latestAllowed = new Date(today);
  latestAllowed.setDate(today.getDate() + maxDays);

  return selected <= latestAllowed
    ? ""
    : `Date must be within the next ${maxDays} days.`;
};
