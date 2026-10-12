
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../src/data");
const errors = [];
const warnings = [];

function load(filename) {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${filename}`);
    return [];
  }

  try {
    const value = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!Array.isArray(value)) {
      errors.push(`${filename} must contain a JSON array.`);
      return [];
    }

    return value;
  } catch (error) {
    errors.push(`${filename} contains invalid JSON: ${error.message}`);
    return [];
  }
}

const files = {
  students: "students.json",
  requests: "requests.json",
  appointments: "appointments.json",
  goodMoralRequests: "goodMoralRequests.json",
  documents: "documents.json",
  counselingRecords: "counselingRecords.json",
  referrals: "referrals.json",
  followUps: "followUps.json",
  programs: "programs.json",
  announcements: "announcements.json",
  notifications: "notifications.json",
  auditLog: "auditLog.json",
  walkIns: "walkIns.json",
  careerServices: "careerServices.json",
  recommendations: "recommendations.json",
  analyticsSnapshots: "analyticsSnapshots.json",
};

const data = {};

for (const [key, filename] of Object.entries(files)) {
  data[key] = load(filename);
}

const users = load("users.json");
const services = load("services.json");

function buildIdSet(collectionName, label) {
  const records = data[collectionName] ?? [];
  const ids = new Set();

  for (const [index, record] of records.entries()) {
    if (!record.id) {
      errors.push(
        `${files[collectionName]} record #${index + 1} has no id.`
      );
      continue;
    }

    if (ids.has(record.id)) {
      errors.push(
        `${files[collectionName]} has duplicate ID "${record.id}".`
      );
    }

    ids.add(record.id);
  }

  return ids;
}

const ids = {};

for (const collectionName of Object.keys(files)) {
  ids[collectionName] = buildIdSet(collectionName);
}

const userIds = new Set();
const facilitatorIds = new Set();
const counselorIds = new Set();

for (const [index, user] of users.entries()) {
  if (!user.id) {
    errors.push(`users.json record #${index + 1} has no id.`);
  } else if (userIds.has(user.id)) {
    errors.push(`users.json has duplicate ID "${user.id}".`);
  } else {
    userIds.add(user.id);
  }

  if (user.facilitatorId) facilitatorIds.add(user.facilitatorId);
  if (user.counselorId) counselorIds.add(user.counselorId);
}

const staffIds = new Set([...facilitatorIds, ...counselorIds]);
const serviceIds = new Set(services.map((service) => service.id).filter(Boolean));

function checkReference(filename, records, field, allowedIds, required = false) {
  records.forEach((record, index) => {
    const value = record[field];

    if (value === undefined || value === null || value === "") {
      if (required) {
        errors.push(
          `${filename} record ${record.id ?? `#${index + 1}`} is missing "${field}".`
        );
      }
      return;
    }

    if (!allowedIds.has(value)) {
      errors.push(
        `${filename} record ${record.id ?? `#${index + 1}`} has invalid ${field}: "${value}".`
      );
    }
  });
}

// Student references.
for (const key of [
  "requests",
  "appointments",
  "goodMoralRequests",
  "documents",
  "counselingRecords",
  "referrals",
  "followUps",
  "walkIns",
  "careerServices",
]) {
  checkReference(files[key], data[key], "studentId", ids.students, true);
}

// Related record references.
checkReference(
  files.counselingRecords,
  data.counselingRecords,
  "appointmentId",
  ids.appointments,
  true
);

checkReference(
  files.goodMoralRequests,
  data.goodMoralRequests,
  "documentId",
  ids.documents,
  true
);

for (const key of ["referrals", "followUps"]) {
  checkReference(
    files[key],
    data[key],
    "counselingRecordId",
    ids.counselingRecords,
    true
  );
}

// User references.
checkReference("notifications.json", data.notifications, "userId", userIds, true);
checkReference("auditLog.json", data.auditLog, "userId", userIds, true);
checkReference("users.json", users, "studentId", ids.students, false);

// Staff references.
for (const key of [
  "requests",
  "appointments",
  "followUps",
  "careerServices",
]) {
  checkReference(files[key], data[key], "assignedTo", staffIds, true);
}

checkReference(
  "goodMoralRequests.json",
  data.goodMoralRequests,
  "processedBy",
  facilitatorIds,
  true
);

checkReference(
  "counselingRecords.json",
  data.counselingRecords,
  "counselorId",
  counselorIds,
  true
);

// Service references are optional, but if present they must be valid.
checkReference(
  "appointments.json",
  data.appointments,
  "serviceId",
  serviceIds,
  false
);

// Check standard ID formats for the primary record types.
const expectedPrefixes = {
  students: "STU",
  requests: "REQ",
  appointments: "APT",
  goodMoralRequests: "GMR",
  documents: "DOC",
  counselingRecords: "CR",
  referrals: "REF",
  followUps: "FUP",
  programs: "PRG",
  announcements: "ANN",
  notifications: "NOT",
  auditLog: "AUD",
  walkIns: "WLK",
  careerServices: "CAR",
  recommendations: "REC",
  analyticsSnapshots: "SNAP",
};

for (const [key, prefix] of Object.entries(expectedPrefixes)) {
  for (const record of data[key]) {
    if (record.id && !new RegExp(`^${prefix}-\\d{4,}$`).test(record.id)) {
      errors.push(
        `${files[key]} has nonstandard ID "${record.id}". Expected ${prefix}-0001 format.`
      );
    }
  }
}

const totalRecords = Object.values(data).reduce(
  (sum, records) => sum + records.length,
  0
);

console.log("\n=== DATA REFERENCE VALIDATION ===");
console.log(`Records checked: ${totalRecords + users.length + services.length}`);
console.log(`Errors found: ${errors.length}`);

if (warnings.length) {
  console.log(`Warnings: ${warnings.length}`);
  warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
}

if (errors.length) {
  console.log("\nProblems to fix:");

  errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });

  process.exitCode = 1;
} else {
  console.log("All checked IDs and references are valid.");
}
