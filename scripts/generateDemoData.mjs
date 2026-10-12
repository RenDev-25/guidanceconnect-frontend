
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../src/data");

const writeJson = (filename, records) => {
  fs.writeFileSync(
    path.join(DATA_DIR, filename),
    JSON.stringify(records, null, 2) + "\n",
    "utf8"
  );
};

const pad = (number) => String(number).padStart(4, "0");
const id = (prefix, number) => `${prefix}-${pad(number)}`;

const students = [
  ["Renzy", "BS Information Technology", 2, "IT-2101"],
  ["Chloe Gonzaga", "BS Information Technology", 2, "IT-2101"],
  ["Jiselle Marasigan", "BS Information Technology", 2, "IT-2101"],
  ["John Timothy Carranza", "BS Information Technology", 2, "IT-2101"],
  ["Mark Villanueva", "BS Computer Science", 3, "CS-3101"],
  ["Sarah Dimaculangan", "BS Computer Science", 1, "CS-1102"],
  ["Angela Reyes", "BS Information Technology", 1, "IT-1102"],
  ["Miguel Ramos", "BS Information Technology", 3, "IT-3101"],
  ["Andrea Mendoza", "BS Computer Science", 2, "CS-2101"],
  ["Joshua Garcia", "BS Information Technology", 4, "IT-4101"],
  ["Patricia Flores", "BS Information Technology", 1, "IT-1101"],
  ["Daniel Cruz", "BS Computer Science", 4, "CS-4101"],
].map(([name, program, yearLevel, section], index) => ({
  id: id("STU", index + 1),
  studentNumber: `202${yearLevel}-${String(10001 + index).padStart(5, "0")}`,
  name,
  email: `student${index + 1}@g.batstate-u.edu.ph`,
  program,
  yearLevel,
  section,
  campus: "Alangilan",
  status: index === 5 ? "Inactive" : "Active",
}));

const studentAt = (index) => students[index % students.length];
const staff = ["FAC-001", "FAC-002", "FAC-003"];
const counselors = ["CNS-001", "CNS-002"];

const dates = [
  "2026-07-15", "2026-07-22", "2026-07-29",
  "2026-08-03", "2026-08-10", "2026-08-17",
  "2026-08-24", "2026-08-29", "2026-09-02",
  "2026-09-08", "2026-09-12", "2026-09-18",
  "2026-09-22", "2026-09-26", "2026-09-30",
  "2026-10-02", "2026-10-05", "2026-10-08",
  "2026-10-10", "2026-10-12",
];

const dateAt = (index) => dates[index % dates.length];

const serviceTypes = [
  "Individual Counseling",
  "Good Moral Certificate",
  "Career Guidance",
  "Academic Counseling",
  "Clearance Signing",
];

const requestStatuses = [
  "Pending", "Processing", "Completed", "Pending", "In Progress",
  "Completed", "Cancelled", "Under Review", "Completed", "Pending",
];

const requests = Array.from({ length: 25 }, (_, i) => ({
  id: id("REQ", i + 1),
  studentId: studentAt(i).id,
  serviceType: serviceTypes[i % serviceTypes.length],
  status: requestStatuses[i % requestStatuses.length],
  dateSubmitted: dateAt(i),
  assignedTo: staff[i % staff.length],
  priority: i % 5 === 0 ? "High" : i % 3 === 0 ? "Low" : "Normal",
  completedAt:
    requestStatuses[i % requestStatuses.length] === "Completed"
      ? dateAt(i + 2)
      : null,
}));

const appointmentStatuses = [
  "Scheduled", "Completed", "Cancelled", "No-Show", "Completed",
  "Scheduled", "Completed", "Scheduled", "Cancelled", "Completed",
  "No-Show", "Scheduled", "Completed", "Scheduled", "Completed",
];

const appointments = Array.from({ length: 15 }, (_, i) => ({
  id: id("APT", i + 1),
  studentId: studentAt(i).id,
  type: [
    "Individual Counseling",
    "Academic Counseling",
    "Career Guidance",
  ][i % 3],
  date: dateAt(i + 3),
  time: [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM",
  ][i % 5],
  mode: i % 2 === 0 ? "Online" : "Face-to-Face",
  status: appointmentStatuses[i],
  counselor: ["Dr. Santos", "Dr. Reyes"][i % 2],
  assignedTo: counselors[i % counselors.length],
}));

const documents = Array.from({ length: 15 }, (_, i) => ({
  id: id("DOC", i + 1),
  studentId: studentAt(i).id,
  type: i % 3 === 0 ? "Good Moral Certificate" : "Supporting Document",
  fileName: `student-${pad(i + 1)}-document.pdf`,
  status: ["Pending", "Verified", "Rejected"][i % 3],
  createdDate: dateAt(i + 1),
}));

const goodMoralRequests = Array.from({ length: 12 }, (_, i) => ({
  id: id("GMR", i + 1),
  studentId: studentAt(i).id,
  studentName: studentAt(i).name,
  requestDate: dateAt(i + 2),
  dateRequested: dateAt(i + 2),
  purpose: [
    "Scholarship Application",
    "Employment",
    "Internship",
    "Transfer to Another School",
    "Personal Copy",
    "School Requirement",
  ][i % 6],
  status: [
    "Pending", "Processing", "Completed", "Rejected",
  ][i % 4],
  processedBy: staff[i % staff.length],
  documentId: id("DOC", i + 1),
}));

const counselingRecords = Array.from({ length: 10 }, (_, i) => ({
  id: id("CR", i + 1),
  studentId: studentAt(i).id,
  studentName: studentAt(i).name,
  appointmentId: id("APT", i + 1),
  counselorId: counselors[i % counselors.length],
  sessionDate: dateAt(i + 2),
  date: dateAt(i + 2),
  sessionType: [
    "Individual Counseling",
    "Academic Counseling",
    "Career Counseling",
  ][i % 3],
  status: i < 7 ? "Completed" : "Scheduled",
  summary:
    i < 7
      ? "Demo record: student attended the scheduled counseling session."
      : "Demo record: session is awaiting completion.",
  nextAction: i % 2 === 0 ? "Follow-up" : "Monitor progress",
}));

const referrals = Array.from({ length: 8 }, (_, i) => ({
  id: id("REF", i + 1),
  studentId: studentAt(i).id,
  counselingRecordId: id("CR", i + 1),
  referredTo: [
    "Career Services",
    "Academic Advising",
    "Student Support",
    "Office of Guidance and Counseling",
  ][i % 4],
  reason: [
    "Career guidance requested",
    "Academic support recommended",
    "Additional student support needed",
    "Follow-up assessment recommended",
  ][i % 4],
  status: ["Pending", "Accepted", "Completed", "Pending"][i % 4],
  dateCreated: dateAt(i + 4),
}));

const followUps = Array.from({ length: 10 }, (_, i) => ({
  id: id("FUP", i + 1),
  studentId: studentAt(i).id,
  studentName: studentAt(i).name,
  counselingRecordId: id("CR", (i % 10) + 1),
  scheduledDate: [
    "2026-07-20",
    "2026-08-01",
    "2026-08-15",
    "2026-09-20",
    "2026-09-25",
    "2026-09-28",
    "2026-10-14",
    "2026-10-16",
    "2026-10-20",
    "2026-10-22",
  ][i],
  dueDate: [
    "2026-07-20",
    "2026-08-01",
    "2026-08-15",
    "2026-09-20",
    "2026-09-25",
    "2026-09-28",
    "2026-10-14",
    "2026-10-16",
    "2026-10-20",
    "2026-10-22",
  ][i],
  actionRequired: [
    "Check academic progress",
    "Review counseling action plan",
    "Confirm student support needs",
    "Check referral progress",
    "Schedule a follow-up session",
  ][i % 5],
  status: [
    "Pending", "Pending", "Pending",
    "Completed", "Completed", "Completed",
    "Scheduled", "Scheduled", "Scheduled", "Scheduled",
  ][i],
  assignedTo: counselors[i % counselors.length],
}));

const programs = Array.from({ length: 6 }, (_, i) => ({
  id: id("PRG", i + 1),
  name: [
    "Career Orientation Program",
    "Student Wellness Seminar",
    "Stress Management Workshop",
    "Career Preparation Session",
    "Peer Support Program",
    "Academic Success Seminar",
  ][i],
  category: [
    "Career Development",
    "Wellness",
    "Mental Health",
    "Career Development",
    "Student Support",
    "Academic Support",
  ][i],
  description: "Demo program record for the Guidance and Counseling System.",
  startDate: dateAt(i + 6),
  endDate: dateAt(i + 6),
  status: ["Scheduled", "Completed", "Scheduled"][i % 3],
  targetAudience: ["All Students", "First-Year Students", "Third-Year Students"][i % 3],
}));

const announcements = Array.from({ length: 6 }, (_, i) => ({
  id: id("ANN", i + 1),
  title: [
    "Guidance Week 2026",
    "Career Orientation Announcement",
    "Student Wellness Seminar",
    "Counseling Services Reminder",
    "Academic Support Program",
    "Career Preparation Workshop",
  ][i],
  content: "Demo announcement for students using the Guidance and Counseling System.",
  audience: i % 2 === 0 ? "All Students" : "Selected Students",
  status: i < 4 ? "Published" : "Draft",
  publishDate: dateAt(i + 8),
  expirationDate: dateAt(i + 10),
}));

// The project currently has three user records. Use their existing IDs
// so every notification has a valid userId reference.
const notificationUsers = [
  { userId: "USR-0001", targetRole: "student" },
  { userId: "USR-0002", targetRole: "facilitator" },
  { userId: "USR-0003", targetRole: "counselor" },
];

const notifications = notificationUsers.flatMap(({ userId, targetRole }, roleIndex) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `NOT-${String(roleIndex * 10 + i + 1).padStart(4, "0")}`,
    userId,
    targetRole,
    title: [
      "Request Status Updated",
      "Appointment Reminder",
      "New Guidance Announcement",
      "Document Status Updated",
      "Follow-up Reminder",
    ][i % 5],
    message: "This is a sample notification for demonstration and testing.",
    type: ["Request", "Appointment", "Announcement", "Document", "Follow-up"][i % 5],
    isRead: i % 2 === 0,
    createdAt: `${dateAt(i + roleIndex)}T09:30:00`,
  }))
);

const auditLog = Array.from({ length: 15 }, (_, i) => ({
  id: id("AUD", i + 1),
  userId: ["USR-0002", "USR-0003"][i % 2],
  action: [
    `Updated request ${id("REQ", (i % 25) + 1)} status`,
    `Reviewed document ${id("DOC", (i % 15) + 1)}`,
    `Updated appointment ${id("APT", (i % 15) + 1)}`,
    `Reviewed Good Moral request ${id("GMR", (i % 12) + 1)}`,
    `Updated follow-up ${id("FUP", (i % 10) + 1)}`,
  ][i % 5],
  timestamp: `${dateAt(i + 3)}T${String(9 + (i % 8)).padStart(2, "0")}:15:00`,
}));

const walkIns = Array.from({ length: 6 }, (_, i) => ({
  id: id("WLK", i + 1),
  studentId: studentAt(i + 1).id,
  studentName: studentAt(i + 1).name,
  purpose: [
    "Good Moral Certificate",
    "Counseling Walk-In",
    "Career Guidance",
    "Academic Concern",
    "Document Inquiry",
    "Student Support",
  ][i],
  status: ["Waiting", "Serving", "Served"][i % 3],
  timeIn: [
    "09:15 AM", "09:22 AM", "10:00 AM",
    "10:30 AM", "01:15 PM", "02:00 PM",
  ][i],
}));

const datasets = {
  "students.json": students,
  "requests.json": requests,
  "appointments.json": appointments,
  "goodMoralRequests.json": goodMoralRequests,
  "documents.json": documents,
  "counselingRecords.json": counselingRecords,
  "referrals.json": referrals,
  "followUps.json": followUps,
  "programs.json": programs,
  "announcements.json": announcements,
  "notifications.json": notifications,
  "auditLog.json": auditLog,
  "walkIns.json": walkIns,
};

if (!fs.existsSync(DATA_DIR)) {
  throw new Error(`Data folder not found: ${DATA_DIR}`);
}

for (const [filename, records] of Object.entries(datasets)) {
  writeJson(filename, records);
  console.log(`${filename}: ${records.length} records`);
}

console.log("\nDemo data generation completed.");
console.log("Review the generated JSON files before running the app.");
