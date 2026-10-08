import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaLightbulb, FaChartBar, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const RecommendationCard = ({ 
  recommendation, 
  onAccept, 
  onDismiss, 
  onView 
}) => {
  const { 
    title, 
    priority, 
    condition, 
    supportingData, 
    recommendedAction, 
    status 
  } = recommendation;

  // Determine styling based on Priority
  let borderTheme = 'secondary';
  let PriorityIcon = FaLightbulb;
  
  if (priority === 'High') {
    borderTheme = 'danger';
    PriorityIcon = FaExclamationTriangle;
  } else if (priority === 'Medium') {
    borderTheme = 'warning';
    PriorityIcon = FaChartBar;
  } else if (priority === 'Low') {
    borderTheme = 'info';
  }

  const isPending = status === 'Pending';

  return (
    <div className={`card h-100 shadow-sm border-0 border-start border-${borderTheme} border-4`}>
      <div className="card-body d-flex flex-column">
        {/* Header: Title & Badges */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className={`text-${borderTheme === 'warning' ? 'warning text-dark' : borderTheme} bg-light p-2 rounded`}>
              <PriorityIcon size={18} />
            </div>
            <h5 className="fw-bold mb-0 text-dark">{title}</h5>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <span className={`badge bg-${borderTheme === 'warning' ? 'warning text-dark' : borderTheme}`}>
              {priority} Priority
            </span>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Body: Condition & Supporting Data */}
        <div className="mb-3">
          <p className="text-muted small fw-semibold text-uppercase mb-1">Detected Condition</p>
          <p className="mb-2 text-dark">{condition}</p>
          
          {supportingData && (
            <div className="bg-light rounded p-2 d-inline-flex align-items-center gap-2 border">
              <FaChartBar className="text-secondary" size={14} />
              <span className="small text-muted">{supportingData.label}:</span>
              <span className="fw-bold text-dark">{supportingData.metric}</span>
            </div>
          )}
        </div>

        {/* Recommended Action block */}
        <div className="mt-auto mb-4 p-3 bg-primary bg-opacity-10 rounded border border-primary border-opacity-25">
          <p className="text-primary fw-semibold small text-uppercase mb-1">Recommended Action</p>
          <p className="mb-0 text-dark fw-medium">{recommendedAction}</p>
        </div>

        {/* Footer: Actions */}
        <div className="d-flex gap-2 mt-auto pt-3 border-top">
          <button 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1 flex-grow-1"
            onClick={() => onView(recommendation)}
          >
            <FaEye /> View Details
          </button>
          
          {isPending && (
            <>
              <button 
                className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center gap-1 flex-grow-1"
                onClick={() => onAccept(recommendation.id)}
              >
                <FaCheck /> Accept
              </button>
              <button 
                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1 flex-grow-1"
                onClick={() => onDismiss(recommendation.id)}
              >
                <FaTimes /> Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

RecommendationCard.propTypes = {
  recommendation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    supportingData: PropTypes.object,
    recommendedAction: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default RecommendationCard;  