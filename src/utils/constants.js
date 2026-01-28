// frontend/src/utils/constants.js

// ==============================
// USER ROLES
// ==============================
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  CLIENT: "client",
};

// ==============================
// COMMON STATUS
// ==============================
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  // Attendance specific
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
};

// ==============================
// API ENDPOINTS
// ==============================
export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh-token",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",

  USERS: "/users",
  EMPLOYEES: "/employees",
  ATTENDANCE: "/attendance",
  PAYROLL: "/payroll",
  CLIENTS: "/clients",
  PROJECTS: "/projects",
  ROOMS: "/rooms",
  ASSETS: "/assets",
  FINANCE: "/finance",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
  ACTIVITIES: "/activities",
};

// ==============================
// DASHBOARD MENU (RESTRICTED TO ADMIN & MANAGER)
// ==============================
export const DASHBOARD_MENU = [
  {
    label: "Dashboard",
    route: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Employees",
    route: "/dashboard/employees",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Attendance",
    route: "/dashboard/attendance",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Payroll",
    route: "/dashboard/payroll",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Clients",
    route: "/dashboard/clients",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Projects",
    route: "/dashboard/projects",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Rooms",
    route: "/dashboard/rooms",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Assets",
    route: "/dashboard/assets",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Finance",
    route: "/dashboard/finance",
    roles: [ROLES.ADMIN], // Sirf Admin
  },
  {
    label: "Reports",
    route: "/dashboard/reports",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Notifications",
    route: "/dashboard/notifications",
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Activity Logs",
    route: "/dashboard/activities",
    roles: [ROLES.ADMIN], // Sirf Admin
  },
  {
    label: "Settings",
    route: "/dashboard/settings",
    roles: [ROLES.ADMIN], // Sirf Admin
  },
];