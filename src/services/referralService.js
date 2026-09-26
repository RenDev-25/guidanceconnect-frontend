import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawReferrals from "../data/referrals.json";

const TABLE = "gc_referrals";

initTable(TABLE, rawReferrals);

export const referralService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (referral) => referral.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (referral) =>
        referral.studentId === studentId
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (referral) =>
        referral.status === status
    );
  },

  create: (data) => {
    const referrals = getTable(TABLE);

    const newReferral = {
      id: `REF-${String(
        referrals.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...referrals,
      newReferral,
    ]);

    return newReferral;
  },

  updateStatus: (id, status) => {
    const referrals = getTable(TABLE);

    const updatedReferrals =
      referrals.map((referral) =>
        referral.id === id
          ? {
              ...referral,
              status,
            }
          : referral
      );

    saveTable(TABLE, updatedReferrals);

    return updatedReferrals.find(
      (referral) =>
        referral.id === id
    );
  },
};