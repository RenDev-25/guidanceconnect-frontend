
import React, { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { aiService } from '../../services/aiService';

const AIInsights = () => {
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError('');
    setCopyMessage('');

    try {
      // Get the current analytics from the existing analytics service.
      const analyticsData = analyticsService.getAnalyticsData();

      setAnalytics(analyticsData);

      // Generate a plain-language summary using the mock AI service.
      const generatedInsights =
        await aiService.generateAdminInsights(analyticsData);

      setInsights(generatedInsights);
    } catch (err) {
      console.error('Failed to load Admin AI Insights:', err);
      setError(
        'Unable to generate insights. Please check the analytics data and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleCopyReport = async () => {
    if (!insights?.draftReport) return;

    try {
      await navigator.clipboard.writeText(insights.draftReport);
      setCopyMessage('Report copied to clipboard.');
    } catch (err) {
      console.error('Could not copy report:', err);
      setCopyMessage(
        'Copying was blocked by the browser. Select and copy the report text manually.'
      );
    }
  };

  const kpis = analytics?.kpis;
  const appointmentSummary = analytics?.summary?.appointments;

  return (
    <div className="container-fluid py-4">
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary">DEMO AI</span>
            <span className="text-muted small">
              Administrative Intelligence
            </span>
          </div>

          <h2 className="fw-bold mb-1">AI Insights</h2>

          <p className="text-muted mb-0">
            A plain-language overview of Guidance and Counseling operations.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadInsights}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Refresh Insights'}
        </button>
      </div>

      {/* Demo AI disclaimer */}
      <div className="alert alert-info border-0 shadow-sm mb-4">
        <strong>Demo AI notice:</strong> This page generates summaries from
        the system's available analytics using predefined logic. It is not
        connected to a live AI model. Review all figures before using the
        report for official decisions.
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              aria-label="Generating insights"
            />
            <h5 className="fw-semibold">Analyzing available data...</h5>
            <p className="text-muted mb-0">
              Preparing the operational summary and draft report.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{error}</p>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={loadInsights}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && insights && (
        <>
          {/* KPI cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-2">
                    Total Requests
                  </p>
                  <h3 className="fw-bold mb-0">
                    {kpis?.totalRequests ?? 0}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-2">
                    Completion Rate
                  </p>
                  <h3 className="fw-bold mb-0">
                    {kpis?.completionRate ?? 0}%
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-2">
                    Counseling Appointments
                  </p>
                  <h3 className="fw-bold mb-0">
                    {appointmentSummary?.total ?? 0}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative summary */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">
                Executive Overview
              </h5>
            </div>

            <div className="card-body">
              <p className="mb-0" style={{ lineHeight: 1.8 }}>
                {insights.trendSummary}
              </p>

              {kpis?.averageProcessingDays == null && (
                <p className="text-muted small mt-3 mb-0">
                  Average processing time is unavailable because there are
                  no completed requests with valid submission and completion
                  dates.
                </p>
              )}
            </div>
          </div>

          {/* Attention areas */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">
                Areas Requiring Attention
              </h5>
            </div>

            <div className="card-body">
              {insights.attentionAreas?.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {insights.attentionAreas.map((item, index) => (
                    <li
                      className="list-group-item px-0 py-3"
                      key={`${index}-${item}`}
                    >
                      <div className="d-flex gap-3 align-items-start">
                        <span className="badge bg-warning text-dark mt-1">
                          {index + 1}
                        </span>
                        <p className="mb-0">{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">
                  No attention areas were returned by the demo engine.
                </p>
              )}
            </div>
          </div>

          {/* Service backlog */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">
                Service Request Overview
              </h5>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">Service</th>
                      <th>Total</th>
                      <th>Pending / Active</th>
                      <th>Completed</th>
                    </tr>
                  </thead>

                  <tbody>
                    {analytics?.serviceBacklog?.length > 0 ? (
                      analytics.serviceBacklog.map((service, index) => (
                        <tr key={`${service.service}-${index}`}>
                          <td className="ps-3 fw-medium">
                            {service.service}
                          </td>
                          <td>{service.total}</td>
                          <td>{service.pending}</td>
                          <td>{service.completed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-muted py-4"
                        >
                          No service request data is available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Draft report */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <h5 className="fw-bold mb-1">
                  Draft Executive Report
                </h5>
                <p className="text-muted small mb-0">
                  Review and edit this text before using it officially.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCopyReport}
              >
                Copy Report
              </button>
            </div>

            <div className="card-body">
              <textarea
                className="form-control"
                rows={12}
                readOnly
                value={insights.draftReport || ''}
                aria-label="Draft executive report"
                style={{
                  fontFamily: 'monospace',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />

              {copyMessage && (
                <p className="small mt-2 mb-0" role="status">
                  {copyMessage}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsights;
