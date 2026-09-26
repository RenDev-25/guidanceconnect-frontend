import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawDocuments from "../data/documents.json";

const TABLE = "gc_documents";

initTable(TABLE, rawDocuments);

export const documentService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (document) => document.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (document) =>
        document.studentId === studentId
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (document) =>
        document.status === status
    );
  },

  create: (data) => {
    const documents = getTable(TABLE);

    const newDocument = {
      id: `DOC-${String(
        documents.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...documents,
      newDocument,
    ]);

    return newDocument;
  },

  updateStatus: (id, status) => {
    const documents = getTable(TABLE);

    const updatedDocuments =
      documents.map((document) =>
        document.id === id
          ? { ...document, status }
          : document
      );

    saveTable(TABLE, updatedDocuments);

    return updatedDocuments.find(
      (document) => document.id === id
    );
  },
};