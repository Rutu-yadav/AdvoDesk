// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// User Roles - Only ADMIN and ADVOCATE supported
export const ROLES = {
  ADMIN: 'ADMIN',
  ADVOCATE: 'ADVOCATE'
};

// Case Types
export const CASE_TYPES = {
  CIVIL: 'CIVIL',
  CRIMINAL: 'CRIMINAL'
};

// Case Status
export const CASE_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  WON: 'WON',
  LOST: 'LOST'
};

// Hearing Status
export const HEARING_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  POSTPONED: 'POSTPONED',
  CANCELLED: 'CANCELLED'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'advo_desk_token',
  USER: 'advo_desk_user'
};
