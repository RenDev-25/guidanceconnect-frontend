import { initTable, getTable, saveTable } from '../utils/mockDb';
import { analyticsService } from './analyticsService';
import rawRecommendations from '../data/recommendations.json';

const TABLE = 'gc_recommendations';


initTable(TABLE, rawRecommendations);


const DEFAULT_THRESHOLDS = {
  pendingRequests: 10,
  overdueFollowUps: 5,
  noShowRate: 15, // percentage
  completionRateMin: 60 // percentage
};


const generateMockRecommendations = (analytics, thresholds) => {
  const recs = [];

  // 1. High Pending Requests Rule
  const pendingCount = analytics.summary.requests.pending;
  if (pendingCount > thresholds.pendingRequests) {
    recs.push({
      id: 'REC-PENDING-REQ',
      title: 'High Pending Requests',
      priority: 'High',
      condition: `Pending requests (${pendingCount}) exceed the operational threshold of ${thresholds.pendingRequests}.`,
      supportingData: { metric: pendingCount, label: 'Pending Requests' },
      recommendedAction: 'Assign additional staff or allocate specific hours strictly for processing pending requests.',
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
  }

  // 2. High No-Show Rate Rule
  const apptAnalytics = analytics.summary.appointments;
  const totalAppts = apptAnalytics.total;
  const noShowRate = totalAppts > 0 ? (apptAnalytics.noShow / totalAppts) * 100 : 0;
  
  if (noShowRate > thresholds.noShowRate) {
    recs.push({
      id: 'REC-NO-SHOW',
      title: 'High No-Show Rate',
      priority: 'Medium',
      condition: `Current no-show rate (${noShowRate.toFixed(1)}%) exceeds the threshold of ${thresholds.noShowRate}%.`,
      supportingData: { metric: `${noShowRate.toFixed(1)}%`, label: 'No-Show Rate' },
      recommendedAction: 'Strengthen appointment reminder notifications (e.g., automated SMS alerts 2 hours prior to schedules).',
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
  }

  // 3. Dropping Completion Rate Rule
  const completionRate = analytics.kpis.completionRate;
  if (completionRate > 0 && completionRate < thresholds.completionRateMin) {
    recs.push({
      id: 'REC-LOW-COMPLETION',
      title: 'Declining Completion Rate',
      priority: 'Medium',
      condition: `Overall completion rate (${completionRate}%) is dropping below the optimal ${thresholds.completionRateMin}% baseline.`,
      supportingData: { metric: `${completionRate}%`, label: 'Completion Rate' },
      recommendedAction: 'Review processing bottlenecks in the Document Verification workflow to accelerate resolution times.',
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
  }

  // 4. Overdue Follow-ups Rule (Simulated statically for the prototype if explicit overdue tracking isn't live)
  // In a real scenario, this pulls from analytics.overdueFollowUps
  const overdueCount = 8; 
  if (overdueCount > thresholds.overdueFollowUps) {
    recs.push({
      id: 'REC-OVERDUE-FOLLOWUPS',
      title: 'Overdue Follow-Ups',
      priority: 'High',
      condition: `Overdue follow-ups (${overdueCount}) exceed the allowed threshold of ${thresholds.overdueFollowUps}.`,
      supportingData: { metric: overdueCount, label: 'Overdue Follow-Ups' },
      recommendedAction: 'Prioritize follow-up processing this week. Consider blocking out Thursday afternoon strictly for outbound follow-ups.',
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
  }

  return recs;
};

export const prescriptiveService = {
  /**
   * Generates dynamic recommendations and merges them with persisted user actions.
   */
  getAll: () => {
    // 1. Fetch live operational data
    const currentAnalytics = analyticsService.getAnalyticsData();
    
    // 2. Generate dynamic recommendations based on rules
    const dynamicRecs = generateMockRecommendations(currentAnalytics, DEFAULT_THRESHOLDS);
    
    // 3. Fetch historically saved states (to remember what the admin Accepted/Dismissed)
    const savedRecs = getTable(TABLE) || [];
    
    // 4. Merge logic: If a dynamic rule triggers, check if we already accepted/dismissed it previously.
    const mergedRecs = dynamicRecs.map(dynRec => {
      const existing = savedRecs.find(s => s.id === dynRec.id);
      if (existing) {
         // Override the "Pending" status with the user's saved historical choice
         return { 
           ...dynRec, 
           status: existing.status, 
           dismissReason: existing.dismissReason, 
           actionDate: existing.actionDate 
         };
      }
      return dynRec;
    });

    // Also include historically dismissed/accepted recs even if the condition is no longer triggering
    savedRecs.forEach(saved => {
      if (!mergedRecs.some(m => m.id === saved.id)) {
        mergedRecs.push(saved);
      }
    });

    return mergedRecs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Updates the status of a recommendation and persists it.
   */
  updateStatus: (id, status, dismissReason = null) => {
    const allRecs = prescriptiveService.getAll();
    const targetRec = allRecs.find(r => r.id === id);
    
    if (!targetRec) return null;

    const updatedRec = {
      ...targetRec,
      status,
      dismissReason,
      actionDate: new Date().toISOString()
    };

    const savedRecs = getTable(TABLE) || [];
    const savedIndex = savedRecs.findIndex(r => r.id === id);
    
    if (savedIndex >= 0) {
      savedRecs[savedIndex] = updatedRec;
    } else {
      savedRecs.push(updatedRec);
    }
    
    saveTable(TABLE, savedRecs);
    
    // Note: In production, this would also push an event to auditLogService
    
    return updatedRec;
  },

  accept: (id) => {
    return prescriptiveService.updateStatus(id, 'Accepted');
  },

  dismiss: (id, reason) => {
    return prescriptiveService.updateStatus(id, 'Dismissed', reason);
  }
};