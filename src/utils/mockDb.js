const backupInvalidTable = (tableName, rawData) => {
  const backupKey = `${tableName}__invalid_backup`;

  // Preserve the original value before replacing it.
  if (!localStorage.getItem(backupKey)) {
    localStorage.setItem(backupKey, rawData);
  }
};

export const initTable = (tableName, initialData = []) => {
  const fallbackData = Array.isArray(initialData)
    ? initialData
    : [];

  const storedData = localStorage.getItem(tableName);

  if (storedData === null) {
    localStorage.setItem(
      tableName,
      JSON.stringify(fallbackData)
    );
    return;
  }

  try {
    const parsedData = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      backupInvalidTable(tableName, storedData);

      localStorage.setItem(
        tableName,
        JSON.stringify(fallbackData)
      );
    }
  } catch {
    backupInvalidTable(tableName, storedData);

    localStorage.setItem(
      tableName,
      JSON.stringify(fallbackData)
    );
  }
};

export const getTable = (tableName) => {
  const storedData = localStorage.getItem(tableName);

  if (!storedData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(storedData);

    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    return [];
  }
};

export const saveTable = (tableName, data) => {
  if (!Array.isArray(data)) {
    throw new TypeError(
      `Cannot save "${tableName}": expected an array of records.`
    );
  }

  localStorage.setItem(
    tableName,
    JSON.stringify(data)
  );
};
