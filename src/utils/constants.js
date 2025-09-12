export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const USER_ROLES = {
  UNIVERSITY_ADMIN: "university_admin",
  FACULTY_ADMIN: "faculty_admin",
  TUTOR: "tutor",
  STUDENT: "student",
};

export const ENROLLMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const WEEK_DAYS = {
  1: "Dushanba",
  2: "Seshanba",
  3: "Chorshanba",
  4: "Payshanba",
  5: "Juma",
  6: "Shanba",
  7: "Yakshanba",
};

export const WEEK_DAYS_SHORT = {
  1: "Du",
  2: "Se",
  3: "Ch",
  4: "Pa",
  5: "Ju",
  6: "Sh",
  7: "Ya",
};

export const WEEK_TYPE = {
  odd: "Toq haftalar",
  even: "Juft haftalar",
  both: "Har hafta",
};

export const STATUS_COLORS = {
  active: "success",
  inactive: "default",
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export const CHART_COLORS = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#ff4d4f",
  "#722ed1",
  "#13c2c2",
  "#fa8c16",
  "#a0d911",
];
