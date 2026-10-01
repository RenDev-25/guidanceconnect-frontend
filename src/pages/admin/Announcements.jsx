import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { auditLogService } from '../../services/auditLogService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'All Students',
    priority: 'Normal'
  });

  const fetchAnnouncements = () => setAnnouncements(announcementService.getAll() || []);

  useEffect(() => fetchAnnouncements(), []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '', content: '', targetAudience: 'All Students', priority: 'Normal' });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };

    if (editingItem) {
      announcementService.update(editingItem.id, formData);
      auditLogService.log(user.id, `Updated announcement ${editingItem.id}`);
    } else {
      announcementService.create({
        ...formData,
        datePublished: new Date().toISOString().split('T')[0]
      });
      auditLogService.log(user.id, `Published new announcement: ${formData.title}`);
    }

    setShowModal(false);
    fetchAnnouncements();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    announcementService.delete(id);
    auditLogService.log(user.id, `Deleted announcement ${id}`);
    fetchAnnouncements();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Announcements</h1>
          <p className="text-muted small mb-0">Publish official notices displayed on student and portal dashboards.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          + Publish Announcement
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date Published</th>
                  <th>Title</th>
                  <th>Target Audience</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map(ann => (
                  <tr key={ann.id}>
                    <td className="fw-semibold">{ann.datePublished || ann.date}</td>
                    <td>
                      <div className="fw-semibold text-dark">{ann.title}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '400px' }}>
                        {ann.content}
                      </small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{ann.targetAudience}</span></td>
                    <td>
                      <span className={`badge ${ann.priority === 'High' ? 'bg-danger' : 'bg-info text-dark'}`}>
                        {ann.priority}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenModal(ann)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ann.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No announcements published yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingItem ? 'Edit Announcement' : 'Publish Announcement'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Announcement Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.title} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Target Audience</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.targetAudience} 
                        onChange={e => setFormData({ ...formData, targetAudience: e.target.value })} 
                        placeholder="e.g. All Students, CICS" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Priority Level</label>
                      <select 
                        className="form-select" 
                        value={formData.priority} 
                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High (Urgent Banner)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Content</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={formData.content} 
                      onChange={e => setFormData({ ...formData, content: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">{editingItem ? 'Update' : 'Publish'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;