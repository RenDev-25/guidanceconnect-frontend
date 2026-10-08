import React, { useState, useEffect, useMemo } from 'react';
import { FaLightbulb, FaFilter } from 'react-icons/fa';

import { prescriptiveService } from '../../services/prescriptiveService';

import RecommendationCard from '../../components/common/RecommendationCard';
import DashboardGrid from '../../components/dashboard/DashboardGrid';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal'; // Assumes you have this from Stage 9
import StatusBadge from '../../components/common/StatusBadge';

const PrescriptiveAnalytics = () => {
  // State for data
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [filters, setFilters] = useState({
    status: 'Pending', // Default to showing actionable items
    priority: 'all',
  });

  // State for Interactions (View & Dismiss)
  const [viewedRec, setViewedRec] = useState(null);
  const [dismissTargetId, setDismissTargetId] = useState(null);
  const [dismissReason, setDismissReason] = useState('');

  // Fetch recommendations
  const fetchRecommendations = () => {
    setLoading(true);
    // Simulate slight processing delay
    setTimeout(() => {
      const data = prescriptiveService.getAll();
      setRecommendations(data);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Filter Logic
  const filteredRecs = useMemo(() => {
    return recommendations.filter((rec) => {
      if (filters.status !== 'all' && rec.status !== filters.status) return false;
      if (filters.priority !== 'all' && rec.priority !== filters.priority) return false;
      return true;
    });
  }, [recommendations, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Action Handlers
  const handleAccept = (id) => {
    prescriptiveService.accept(id);
    fetchRecommendations(); // Refresh to update status
  };

  const handleDismissPrompt = (id) => {
    setDismissTargetId(id);
    setDismissReason('');
  };

  const confirmDismiss = () => {
    if (!dismissReason.trim()) return;
    prescriptiveService.dismiss(dismissTargetId, dismissReason);
    setDismissTargetId(null);
    setDismissReason('');
    fetchRecommendations(); // Refresh to update status
  };

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <FaLightbulb className="text-warning me-2" />
            Prescriptive Insights
          </h1>
          <p className="text-muted mb-0">
            Actionable recommendations based on current operational analytics.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="mb-4 bg-light border-0 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label text-muted small fw-semibold mb-1">Status Filter</label>
            <select
              className="form-select form-select-sm"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending (Action Required)</option>
              <option value="Accepted">Accepted</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label text-muted small fw-semibold mb-1">Priority Filter</label>
            <select
              className="form-select form-select-sm"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <button 
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setFilters({ status: 'all', priority: 'all' })}
            >
              <FaFilter /> Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Recommendations Grid */}
      {loading ? (
        <LoadingState message="Analyzing operational data for recommendations..." />
      ) : filteredRecs.length === 0 ? (
        <Card>
          <EmptyState 
            message={`No ${filters.status !== 'all' ? filters.status.toLowerCase() : ''} recommendations found.`} 
            icon="bi-check-all" 
          />
        </Card>
      ) : (
        <div className="row g-4">
          {filteredRecs.map((rec) => (
            <div key={rec.id} className="col-12 col-xl-6">
              <RecommendationCard 
                recommendation={rec}
                onAccept={handleAccept}
                onDismiss={handleDismissPrompt}
                onView={setViewedRec}
              />
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewedRec && (
        <Modal 
          isOpen={!!viewedRec} 
          onClose={() => setViewedRec(null)} 
          title="Insight Details"
        >
          <div className="mb-3 d-flex justify-content-between align-items-center pb-2 border-bottom">
            <h5 className="fw-bold mb-0">{viewedRec.title}</h5>
            <StatusBadge status={viewedRec.status} />
          </div>
          
          <div className="mb-3">
            <h6 className="text-muted small fw-bold text-uppercase mb-1">Trigger Condition</h6>
            <p className="text-dark">{viewedRec.condition}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-primary small fw-bold text-uppercase mb-1">Recommended Action</h6>
            <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded text-dark fw-medium">
              {viewedRec.recommendedAction}
            </div>
          </div>

          {viewedRec.status === 'Dismissed' && viewedRec.dismissReason && (
            <div className="mb-3 p-3 bg-light border rounded">
              <h6 className="text-danger small fw-bold text-uppercase mb-1">Dismissal Reason</h6>
              <p className="mb-0 text-dark fst-italic">"{viewedRec.dismissReason}"</p>
            </div>
          )}
          
          <div className="text-end mt-4">
            <button className="btn btn-secondary" onClick={() => setViewedRec(null)}>Close</button>
          </div>
        </Modal>
      )}

      {/* DISMISS REASON MODAL */}
      {dismissTargetId && (
        <Modal 
          isOpen={!!dismissTargetId} 
          onClose={() => setDismissTargetId(null)}
          title="Dismiss Recommendation"
        >
          <div className="mb-3">
            <p className="text-muted mb-3">
              Please provide a brief reason for dismissing this recommendation. This helps improve future analytics logic.
            </p>
            <label className="form-label fw-semibold">Reason for Dismissal <span className="text-danger">*</span></label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="e.g., Already implementing alternative solution..."
              autoFocus
            ></textarea>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-light" onClick={() => setDismissTargetId(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDismiss} disabled={!dismissReason.trim()}>
              Confirm Dismissal
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default PrescriptiveAnalytics;