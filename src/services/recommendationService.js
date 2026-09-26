import { analyticsService } from "./analyticsService";

export const recommendationService = {
  getPrescriptiveRecommendations: () => {
    const analytics =
      analyticsService.getDashboardAnalytics();

    const recommendations = [];

    const requestAnalytics =
      analytics.requests;

    const appointmentAnalytics =
      analytics.appointments;

    const goodMoralAnalytics =
      analytics.goodMoral;

    /*
     * RULE 1
     * High pending requests
     */
    if (
      requestAnalytics.pending >= 10
    ) {
      recommendations.push({
        id: "REC-001",
        category: "Request Management",
        priority: "High",
        condition:
          "Pending requests reached the defined threshold.",
        suggestedAction:
          "Review pending requests and consider redistributing workload among available facilitators.",
        generatedFrom: {
          pendingRequests:
            requestAnalytics.pending,
          threshold: 10,
        },
      });
    }

    /*
     * RULE 2
     * Low request completion rate
     */
    if (
      requestAnalytics.total > 0 &&
      requestAnalytics.completionRate < 50
    ) {
      recommendations.push({
        id: "REC-002",
        category: "Service Efficiency",
        priority: "Medium",
        condition:
          "Request completion rate is below the defined threshold.",
        suggestedAction:
          "Review processing delays and prioritize older pending requests.",
        generatedFrom: {
          completionRate:
            requestAnalytics.completionRate,
          threshold: 50,
        },
      });
    }

    /*
     * RULE 3
     * High cancelled appointments
     */
    if (
      appointmentAnalytics.cancelled >= 5
    ) {
      recommendations.push({
        id: "REC-003",
        category: "Appointments",
        priority: "Medium",
        condition:
          "Cancelled appointments reached the defined threshold.",
        suggestedAction:
          "Review appointment schedules and consider sending reminder notifications to students.",
        generatedFrom: {
          cancelledAppointments:
            appointmentAnalytics.cancelled,
          threshold: 5,
        },
      });
    }

    /*
     * RULE 4
     * High pending Good Moral requests
     */
    if (
      goodMoralAnalytics.pending >= 5
    ) {
      recommendations.push({
        id: "REC-004",
        category: "Good Moral Processing",
        priority: "High",
        condition:
          "Pending Good Moral requests reached the defined threshold.",
        suggestedAction:
          "Prioritize pending Good Moral requests for processing.",
        generatedFrom: {
          pendingRequests:
            goodMoralAnalytics.pending,
          threshold: 5,
        },
      });
    }

    return recommendations;
  },
};