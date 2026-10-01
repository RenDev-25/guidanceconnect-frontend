import React, { useState, useEffect } from 'react';
import { programService } from '../../services/programService';
import { auditLogService } from '../../services/auditLogService';

const ProgramsAndActivities = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    date: '',
    location: '',
    targetAudience: 'All Students',
    description: '',
    status: 'Upcoming'
  });

  const fetchPrograms = () => setPrograms(programService.getAll() || []);

  useEffect(() => fetchPrograms(), []);

  const handleOpenModal = (prog = null) => {
    if (prog) {
      setEditingProgram(prog);
      setFormData(prog);
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        category: 'Workshop',
        date: new Date().toISOString().split('T')[0],
        location: '',
        targetAudience: 'All Students',
        description: '',
        status: 'Upcoming'
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };

    if (editingProgram) {
      programService.update(editingProgram.id, formData);
      auditLogService.log(user.id, `Updated program: ${formData.title}`);
    } else {
      programService.create(formData);
      auditLogService.log(user.id, `Created new program: ${formData.title}`);
    }

    setShowModal(false);
    fetchPrograms();
  };

  const handleArchive = (id, currentStatus) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    const newStatus = currentStatus === 'Archived' ? 'Upcoming' : 'Archived';
    programService.update(id, { status: newStatus });
    auditLogService.log(user.id, `Changed program ${id} status to ${newStatus}`);
    fetchPrograms();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Programs & Activities</h1>
          <p className="text-muted small mb-0">Manage Office of Guidance and Counseling (OGC) events, seminars, and workshops.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          + Create Program
        </button>
      </div>

      <div className="row g-4">
        {programs.map(prog => (
          <div key={prog.id} className="col-12 col-md-6 col-xl-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-light text-primary border border-primary-subtle">{prog.category}</span>
                  <span className={`badge ${prog.status === 'Upcoming' ? 'bg-success' : prog.status === 'Completed' ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                    {prog.status}
                  </span>
                </div>
                <h5 className="fw-bold text-dark mb-2">{prog.title}</h5>
                <p className="text-muted small flex-grow-1">{prog.description}</p>
                <div className="border-top pt-3 mt-2 text-muted small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>📅 <strong>Date:</strong> {prog.date}</span>
                    <span>📍 <strong>Venue:</strong> {prog.location}</span>
                  </div>
                  <div>👥 <strong>Target:</strong> {prog.targetAudience}</div>
                </div>
              </div>
              <div className="card-footer bg-white border-0 pt-0 pb-3 d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenModal(prog)}>
                  Edit
                </button>
                <button 
                  className={`btn btn-sm ${prog.status === 'Archived' ? 'btn-outline-success' : 'btn-outline-danger'}`} 
                  onClick={() => handleArchive(prog.id, prog.status)}
                >
                  {prog.status === 'Archived' ? 'Unarchive' : 'Archive'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="col-12">
            <div className="card shadow-sm border-0 text-center py-5 text-muted">
              No programs or activities created yet. Click "+ Create Program" to get started.
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingProgram ? 'Edit Program' : 'Create New Program'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Program Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.title} 
                        onChange={e => setFormData({ ...formData, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category</label>
                      <select 
                        className="form-select" 
                        value={formData.category} 
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Orientation">Orientation</option>
                        <option value="Mental Health Awareness">Mental Health Awareness</option>
                        <option value="Career Fair">Career Fair</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formData.date} 
                        onChange={e => setFormData({ ...formData, date: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Location / Venue</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.location} 
                        onChange={e => setFormData({ ...formData, location: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Target Audience</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.targetAudience} 
                        onChange={e => setFormData({ ...formData, targetAudience: e.target.value })} 
                        placeholder="e.g. All Students, 1st Year" 
                        required 
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        value={formData.description} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">{editingProgram ? 'Update Program' : 'Save Program'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsAndActivities;