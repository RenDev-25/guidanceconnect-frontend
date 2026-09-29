// src/utils/mockDb.js

export const initTable = (tableName, initialData) => {
  // Only initialize if the table doesn't already exist in localStorage
  if (!localStorage.getItem(tableName)) {
    localStorage.setItem(tableName, JSON.stringify(initialData || []));
  }
};

export const getTable = (tableName) => {
  const data = localStorage.getItem(tableName);
  return data ? JSON.parse(data) : [];
};

export const saveTable = (tableName, data) => {
  localStorage.setItem(tableName, JSON.stringify(data));
};