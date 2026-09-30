import React, { useState, useEffect } from 'react';
import { counselingService } from '../../services/counselingService';

const CounselingRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = () => {
    setRecords(counselingService.getAll() || []);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (selectedRecord) {
      counselingService.update(selectedRecord.id, {
        summary: selectedRecord.summary,
        nextAction: selectedRecord.nextAction,
      });
      fetchRecords();
      setSelectedRecord(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Counseling Records</h1>
          <p className="text-muted small">Maintain factual session summaries and scheduled follow-up actions.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className={selectedRecord ? "col-lg-7" : "col-12"}>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Record ID</th>
                      <th>Student Name</th>
                      <th>Session Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.map((rec) => (
                        <tr key={rec.id}>
                          <td className="fw-semibold">{rec.id}</td>
                          <td>{rec.studentName}</td>
                          <td>{rec.date}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedRecord(rec)}
                            >
                              Edit Notes
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">No counseling records logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {selectedRecord && (
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Record Notes: {selectedRecord.studentName}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRecord(null)}></button>
              </div>
              <div className="card-body">
                <form onSubmit={handleSaveNotes}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Session Summary</label>
                    <textarea 
                      className="form-control form-control-sm" 
                      rows="4"
                      value={selectedRecord.summary || ''}
                      onChange={(e) => setSelectedRecord({ ...selectedRecord, summary: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Next Follow-Up Action</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm"
                      value={selectedRecord.nextAction || ''}
                      onChange={(e) => setSelectedRecord({ ...selectedRecord, nextAction: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm w-100">Update Session Log</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselingRecords;