
import { requestService } from "./requestService";
import { appointmentService } from "./appointmentService";
import { goodMoralService } from "./goodMoralService";
import { counselingService } from "./counselingService";
import { documentService } from "./documentService";
import servicesData from "../data/services.json";

// Keep status names centralized so every chart uses the same definitions.
const COMPLETED_STATUSES = ["Completed"];
const PENDING_STATUSES = ["Pending", "Submitted", "For Verification", "Under Review"];
const ACTIVE_REQUEST_STATUSES = [
  "Pending",
  "Processing",
  "In Progress",
  "Under Review",
];
const CANCELLED_STATUSES = ["Cancelled", "Canceled"];
const NO_SHOW_STATUSES = ["No-show", "No Show", "No-Show"];

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  return value && typeof value === "object" ? [value] : [];
};

const clean = (value) =>
  String(value ?? "").trim();

const normalized = (value) =>
  clean(value).toLowerCase();

const isOneOf = (value, values) =>
  values.some((item) => normalized(item) === normalized(value));

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getRecordDate = (record, fields) => {
  for (const field of fields) {
    const date = parseDate(record?.[field]);
    if (date) return date;
  }

  return null;
};

const getServiceName = (record) =>
  clean(
    record?.serviceType ??
    record?.serviceName ??
    record?.type ??
    record?.sessionType ??
    "Unspecified"
  );

const getRecordMode = (record) =>
  clean(
    record?.appointmentMode ??
    record?.sessionMode ??
    record?.counselingMode ??
    record?.mode ??
    record?.modality
  );

const getCatalogService = (serviceName) =>
  asArray(servicesData).find(
    (service) =>
      normalized(service.name) === normalized(serviceName)
  );

const getMode = (record) => {
  const explicitMode = getRecordMode(record);
  if (explicitMode) return explicitMode;

  const service = getCatalogService(getServiceName(record));
  return clean(service?.mode);
};

const getFilteredRecords = (
  records,
  {
    startDate = "",
    endDate = "",
    serviceType = "all",
    appointmentMode = "all",
    dateFields = ["dateSubmitted"],
    useServiceCatalog = true,
  } = {}
) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return asArray(records).filter((record) => {
    const recordDate = getRecordDate(record, dateFields);

    // If a date filter is active, records without a valid date
    // cannot be reliably included in that date range.
    if ((start || end) && !recordDate) return false;

    if (start && recordDate < start) return false;

    if (end) {
      const inclusiveEnd = new Date(end);
      inclusiveEnd.setHours(23, 59, 59, 999);

      if (recordDate > inclusiveEnd) return false;
    }

    if (
      serviceType !== "all" &&
      normalized(getServiceName(record)) !== normalized(serviceType)
    ) {
      return false;
    }

    if (appointmentMode !== "all") {
      const mode = useServiceCatalog
        ? getMode(record)
        : getRecordMode(record);

      if (normalized(mode) !== normalized(appointmentMode)) {
        return false;
      }
    }

    return true;
  });
};

const groupCount = (records, getLabel) => {
  const counts = new Map();

  asArray(records).forEach((record) => {
    const label = clean(getLabel(record)) || "Unspecified";
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts, ([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);
};

const getProcessingDays = (request) => {
  const submitted = getRecordDate(request, [
    "dateSubmitted",
    "submittedAt",
    "createdAt",
  ]);

  const completed = getRecordDate(request, [
    "completedAt",
    "dateCompleted",
    "processedAt",
    "dateProcessed",
    "resolvedAt",
  ]);

  if (!submitted || !completed || completed < submitted) {
    return null;
  }

  return (completed.getTime() - submitted.getTime()) /
    (1000 * 60 * 60 * 24);
};

const getAverageProcessingTime = (requests) => {
  const durations = asArray(requests)
    .filter((request) =>
      isOneOf(request.status, COMPLETED_STATUSES)
    )
    .map(getProcessingDays)
    .filter((duration) => duration !== null);

  if (!durations.length) return null;

  const average =
    durations.reduce((sum, duration) => sum + duration, 0) /
    durations.length;

  return Number(average.toFixed(1));
};

const getCompletionRate = (requests) => {
  const records = asArray(requests);

  if (!records.length) return 0;

  const completed = records.filter((request) =>
    isOneOf(request.status, COMPLETED_STATUSES)
  ).length;

  return Number(((completed / records.length) * 100).toFixed(1));
};

const getRequestTrend = (requests, grouping = "daily") => {
  const buckets = new Map();

  asArray(requests).forEach((request) => {
    const date = getRecordDate(request, [
      "dateSubmitted",
      "submittedAt",
      "createdAt",
    ]);

    if (!date) return;

    const day = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    let key;
    let label;

    if (grouping === "monthly") {
      key = `${day.getFullYear()}-${String(
        day.getMonth() + 1
      ).padStart(2, "0")}`;
      label = day.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else if (grouping === "weekly") {
      const weekday = (day.getDay() + 6) % 7;
      const monday = new Date(day);
      monday.setDate(day.getDate() - weekday);

      key = monday.toISOString().slice(0, 10);
      label = `Week of ${monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    } else {
      key = [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, "0"),
        String(day.getDate()).padStart(2, "0"),
      ].join("-");

      label = day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (!buckets.has(key)) {
      buckets.set(key, { date: key, label, requests: 0 });
    }

    buckets.get(key).requests += 1;
  });

  return Array.from(buckets.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

const getServiceBacklog = (requests) => {
  const groups = new Map();

  asArray(requests).forEach((request) => {
    const service = getServiceName(request);

    if (!groups.has(service)) {
      groups.set(service, {
        service,
        completed: 0,
        pending: 0,
        total: 0,
      });
    }

    const item = groups.get(service);
    item.total += 1;

    if (isOneOf(request.status, COMPLETED_STATUSES)) {
      item.completed += 1;
    } else if (
      isOneOf(request.status, ACTIVE_REQUEST_STATUSES) ||
      isOneOf(request.status, PENDING_STATUSES)
    ) {
      item.pending += 1;
    }
  });

  return Array.from(groups.values()).sort(
    (a, b) => b.total - a.total
  );
};

const getAppointmentStatusBreakdown = (appointments) => {
  const statuses = [
    { name: "Completed", match: COMPLETED_STATUSES },
    { name: "No-show", match: NO_SHOW_STATUSES },
    { name: "Cancelled", match: CANCELLED_STATUSES },
  ];

  return statuses.map(({ name, match }) => ({
    name,
    value: asArray(appointments).filter((appointment) =>
      isOneOf(appointment.status, match)
    ).length,
  }));
};

const getCounselingModeBreakdown = (records) => {
  const modes = asArray(records).filter((record) =>
    getRecordMode(record)
  );

  return [
    {
      name: "Online",
      value: modes.filter((record) =>
        normalized(getRecordMode(record)).includes("online")
      ).length,
    },
    {
      name: "Face-to-Face",
      value: modes.filter((record) => {
        const mode = normalized(getRecordMode(record));

        return (
          mode.includes("face-to-face") ||
          mode.includes("face to face") ||
          mode === "in-person" ||
          mode === "in person"
        );
      }).length,
    },
  ];
};

const getGoodMoralPurposeBreakdown = (requests) =>
  groupCount(requests, (request) => request.purpose);

const getRequestAnalytics = (requests) => {
  const records = asArray(requests);

  const pending = records.filter((request) =>
    isOneOf(request.status, ["Pending"])
  ).length;

  const processing = records.filter((request) =>
    isOneOf(request.status, ["Processing", "In Progress", "Under Review"])
  ).length;

  const completed = records.filter((request) =>
    isOneOf(request.status, COMPLETED_STATUSES)
  ).length;

  const rejected = records.filter((request) =>
    isOneOf(request.status, ["Rejected"])
  ).length;

  return {
    total: records.length,
    pending,
    inProgress: processing,
    approved: records.filter((request) =>
      isOneOf(request.status, ["Approved"])
    ).length,
    rejected,
    completed,
    completionRate: getCompletionRate(records),
  };
};

const getAppointmentAnalytics = (appointments) => {
  const records = asArray(appointments);

  return {
    total: records.length,
    scheduled: records.filter((appointment) =>
      isOneOf(appointment.status, ["Scheduled", "Confirmed", "Pending"])
    ).length,
    completed: records.filter((appointment) =>
      isOneOf(appointment.status, COMPLETED_STATUSES)
    ).length,
    cancelled: records.filter((appointment) =>
      isOneOf(appointment.status, CANCELLED_STATUSES)
    ).length,
    noShow: records.filter((appointment) =>
      isOneOf(appointment.status, NO_SHOW_STATUSES)
    ).length,
  };
};

const getGoodMoralAnalytics = (requests) => {
  const records = asArray(requests);

  return {
    total: records.length,
    pending: records.filter((request) =>
      isOneOf(request.status, ["Pending"])
    ).length,
    processing: records.filter((request) =>
      isOneOf(request.status, ["Processing", "In Progress"])
    ).length,
    completed: records.filter((request) =>
      isOneOf(request.status, COMPLETED_STATUSES)
    ).length,
    rejected: records.filter((request) =>
      isOneOf(request.status, ["Rejected"])
    ).length,
  };
};

const getCounselingAnalytics = (records) => {
  const sessions = asArray(records);

  return {
    totalSessions: sessions.length,
    completed: sessions.filter((record) =>
      isOneOf(record.status, COMPLETED_STATUSES)
    ).length,
    scheduled: sessions.filter((record) =>
      isOneOf(record.status, ["Scheduled", "Confirmed", "Pending"])
    ).length,
  };
};

export const analyticsService = {
  // Existing methods retained for compatibility.
  getRequestAnalytics: () =>
    getRequestAnalytics(requestService.getAll()),

  getAppointmentAnalytics: () =>
    getAppointmentAnalytics(appointmentService.getAll()),

  getGoodMoralAnalytics: () =>
    getGoodMoralAnalytics(goodMoralService.getAll()),

  getCounselingAnalytics: () =>
    getCounselingAnalytics(counselingService.getAll()),

  getDashboardAnalytics: () => ({
    requests: analyticsService.getRequestAnalytics(),
    appointments: analyticsService.getAppointmentAnalytics(),
    goodMoral: analyticsService.getGoodMoralAnalytics(),
    counseling: analyticsService.getCounselingAnalytics(),
  }),

  // New filterable aggregation API for Stage 14.
  getAnalyticsData: (filters = {}) => {
    const requests = getFilteredRecords(
      requestService.getAll(),
      {
        ...filters,
        dateFields: ["dateSubmitted", "submittedAt", "createdAt"],
      }
    );

    const appointments = getFilteredRecords(
      appointmentService.getAll(),
      {
        ...filters,
        dateFields: ["date", "appointmentDate", "createdAt"],
        useServiceCatalog: false,
      }
    );

    const goodMoralRequests = getFilteredRecords(
      goodMoralService.getAll(),
      {
        ...filters,
        serviceType: "all",
        appointmentMode: "all",
        dateFields: ["requestDate", "dateSubmitted", "createdAt"],
      }
    );

    const counselingRecords = getFilteredRecords(
      counselingService.getAll(),
      {
        ...filters,
        serviceType: "all",
        dateFields: ["sessionDate", "date", "createdAt"],
        useServiceCatalog: false,
      }
    );

    return {
      kpis: {
        totalRequests: requests.length,
        completionRate: getCompletionRate(requests),
        averageProcessingDays: getAverageProcessingTime(requests),
      },

      requestTrend: getRequestTrend(
        requests,
        filters.grouping || "daily"
      ),

      requestsByService: groupCount(
        requests,
        getServiceName
      ),

      appointmentStatusBreakdown:
        getAppointmentStatusBreakdown(appointments),

      counselingModeBreakdown:
        getCounselingModeBreakdown(counselingRecords),

      goodMoralPurposeBreakdown:
        getGoodMoralPurposeBreakdown(goodMoralRequests),

      serviceBacklog: getServiceBacklog(requests),

      summary: {
        requests: getRequestAnalytics(requests),
        appointments: getAppointmentAnalytics(appointments),
        goodMoral: getGoodMoralAnalytics(goodMoralRequests),
        counseling: getCounselingAnalytics(counselingRecords),
      },

      dataQuality: {
        processingTimeAvailable: requests.some(
          (request) => getProcessingDays(request) !== null
        ),
        counselingModeAvailable: counselingRecords.some(
          (record) => Boolean(getRecordMode(record))
        ),
      },
    };
  },
};
