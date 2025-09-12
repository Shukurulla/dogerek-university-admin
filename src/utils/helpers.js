import dayjs from "dayjs";

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Add +998 if not present
  const withCode = cleaned.startsWith("998") ? cleaned : `998${cleaned}`;

  // Format as +998 XX XXX-XX-XX
  return `+${withCode.slice(0, 3)} ${withCode.slice(3, 5)} ${withCode.slice(
    5,
    8
  )}-${withCode.slice(8, 10)}-${withCode.slice(10, 12)}`;
};

// Format date
export const formatDate = (date, format = "DD.MM.YYYY") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

// Format date range
export const formatDateRange = (start, end) => {
  if (!start || !end) return "";
  return `${formatDate(start)} - ${formatDate(end)}`;
};

// Format time
export const formatTime = (time) => {
  if (!time) return "";
  return dayjs(time, "HH:mm").format("HH:mm");
};

// Format time range
export const formatTimeRange = (start, end) => {
  if (!start || !end) return "";
  return `${start} - ${end}`;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    active: "success",
    inactive: "default",
    pending: "warning",
    approved: "success",
    rejected: "error",
    present: "success",
    absent: "error",
  };
  return colors[status] || "default";
};

// Get status text
export const getStatusText = (status) => {
  const texts = {
    active: "Faol",
    inactive: "Nofaol",
    pending: "Kutilmoqda",
    approved: "Tasdiqlangan",
    rejected: "Rad etilgan",
    present: "Kelgan",
    absent: "Kelmagan",
  };
  return texts[status] || status;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if user has permission
export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

// Sort array by key
export const sortByKey = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    if (order === "asc") {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

// Export data to CSV
export const exportToCSV = (data, filename = "export.csv") => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    Object.keys(data[0]).join(",") +
    "\n" +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
