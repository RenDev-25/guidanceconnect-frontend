
/**
 * Maps a status string to a Bootstrap badge color
 * @param {Object} props
 * @param {string} props.status - e.g., 'Pending', 'Approved', 'Rejected', 'Completed'
 */
const StatusBadge = ({ status }) => {
  const getBadgeColor = (statusText) => {
    switch (statusText?.toLowerCase()) {
      case 'approved':
      case 'completed':                                         
      case 'available':
      case 'active':
        return 'bg-success';
      case 'pending':
      case 'processing':
      case 'scheduled':
        return 'bg-warning text-dark';
      case 'rejected':
      case 'cancelled':
      case 'inactive':
        return 'bg-danger';
      case 'in progress':
      case 'ongoing':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <span className={`badge rounded-pill ${getBadgeColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;