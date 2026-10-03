import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { auditLogService } from '../../services/auditLogService';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    officeName: 'Office of Guidance and Counseling (OGC)',
    operatingHours: '08:00 AM - 05:00 PM',
    contactEmail: 'guidance@university.edu.ph',
    maxAppointmentsPerSlot: 3,
    // Stage 15 Prescriptive Analytics Thresholds
    absenteeismThreshold: 3,
    academicRiskGpaThreshold: 2.5,
    followUpSlaDays: 7,
    highPriorityEscalationDays: 2
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loaded = settingsService.get();
    if (loaded) setSettings(loaded);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };

     settingsService.update(settings);
    auditLogService.log(user.id, `Updated System Settings and Stage 15 Prescriptive Analytics thresholds`);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">System Settings</h1>
          <p className="text-muted small mb-0">Configure office-wide operational parameters and Stage 15 analytics threshold rules.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          ✓ System settings and prescriptive analytics rules updated successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-bottom">
                <h5 className="fw-bold mb-0 text-dark">General Office Settings</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Office Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="officeName" 
                    value={settings.officeName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Operating Hours</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="operatingHours" 
                    value={settings.operatingHours} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Official Contact Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="contactEmail" 
                    value={settings.contactEmail} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Max Appointments Per Slot</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="maxAppointmentsPerSlot" 
                    value={settings.maxAppointmentsPerSlot} 
                    onChange={handleChange} 
                    min="1" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 h-100 border-start border-warning border-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h5 className="fw-bold mb-0 text-dark">Stage 15 Prescriptive Thresholds</h5>
                <small className="text-muted">Dynamic rules for recommendation engine generation</small>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Absenteeism Alert Threshold (Sessions/Days)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="absenteeismThreshold" 
                    value={settings.absenteeismThreshold} 
                    onChange={handleChange} 
                    min="1" 
                    required 
                  />
                  <small className="text-muted">Triggers check-in flag when unexcused absences exceed this count.</small>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Academic Risk GPA Ceiling Threshold</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-control" 
                    name="academicRiskGpaThreshold" 
                    value={settings.academicRiskGpaThreshold} 
                    onChange={handleChange} 
                    required 
                  />
                  <small className="text-muted">Triggers academic support intervention recommendation below this value.</small>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Follow-Up SLA Target (Days)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="followUpSlaDays" 
                    value={settings.followUpSlaDays} 
                    onChange={handleChange} 
                    min="1" 
                    required 
                  />
                  <small className="text-muted">Max days before a pending follow-up action is flagged overdue.</small>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">High Priority Request Escalation Limit (Days)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="highPriorityEscalationDays" 
                    value={settings.highPriorityEscalationDays} 
                    onChange={handleChange} 
                    min="1" 
                    required 
                  />
                  <small className="text-muted">Days pending before auto-escalating unhandled urgent requests.</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary px-4">
              💾 Save All Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;