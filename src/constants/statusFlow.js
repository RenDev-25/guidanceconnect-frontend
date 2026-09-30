// src/constants/statusFlow.js

export const REQUEST_STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  NEEDS_REVISION: 'Needs Revision',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
};

// Defines exactly which statuses a request can transition to based on its current state.
export const ALLOWED_TRANSITIONS = {
  [REQUEST_STATUSES.PENDING]: [REQUEST_STATUSES.IN_PROGRESS, REQUEST_STATUSES.REJECTED],
  [REQUEST_STATUSES.IN_PROGRESS]: [REQUEST_STATUSES.APPROVED, REQUEST_STATUSES.NEEDS_REVISION, REQUEST_STATUSES.REJECTED],
  [REQUEST_STATUSES.NEEDS_REVISION]: [REQUEST_STATUSES.IN_PROGRESS],
  [REQUEST_STATUSES.APPROVED]: [REQUEST_STATUSES.COMPLETED],
  [REQUEST_STATUSES.REJECTED]: [], // Terminal state
  [REQUEST_STATUSES.COMPLETED]: [], // Terminal state
};

// Helper function to check if a transition is legal
export const canTransition = (currentStatus, targetStatus) => {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(targetStatus) : false;
};