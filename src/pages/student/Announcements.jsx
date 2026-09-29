import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import FilterBar from '../../components/common/FilterBar';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { announcementService } from '../../services/announcementService';

const Announcements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'General', 'Counseling', 'Events', 'Deadlines'];

  useEffect(() => {
    setTimeout(() => {
      setAnnouncements(announcementService.getAll() || []);
      setLoading(false);
    }, 400);
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  if (loading) return <LoadingState message="Loading announcements..." />;

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Office Announcements</h3>

      <FilterBar
        filters={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredAnnouncements.length === 0 ? (
        <EmptyState message="No announcements found for this category." icon="bi-megaphone" />
      ) : (
        <div className="row g-4 mt-1">
          {filteredAnnouncements.map((item) => (
            <div className="col-12" key={item.id}>
              <Card>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1">
                    {item.category || 'General'}
                  </span>
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {item.date || item.createdAt}
                  </small>
                </div>
                <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line' }}>
                  {item.content || item.body}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;