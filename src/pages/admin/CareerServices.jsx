import React, { useState, useEffect } from 'react';
import { careerService } from '../../services/careerService';

const CareerServices = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setRecords(careerService.getAll() || []);
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Career Services</h1>
        <p className="text-muted small mb-0">Manage career advising, assessments, and placement records.</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Student Name</th>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(rec => (
                      <tr key={rec.id}>
                        <td className="fw-semibold">{rec.id}</td>
                        <td>{rec.studentName}</td>
                        <td>{rec.serviceType}</td>
                        <td>{rec.date}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => setSelectedRecord(rec)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          {selectedRecord ? (
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Record Details</h6>
                <button type="button" className="btn-close" onClick={() => setSelectedRecord(null)}></button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted d-block">Student Name</small>
                  <span className="fw-semibold">{selectedRecord.studentName}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Service Rendered</small>
                  <span>{selectedRecord.serviceType}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Facilitator</small>
                  <span>{selectedRecord.facilitator}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Outcomes / Notes</small>
                  <p className="small mb-0 p-2 bg-light rounded border">{selectedRecord.notes}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 h-100 bg-light d-flex align-items-center justify-content-center text-muted p-4">
              Select a record from the list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerServices;