import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { documentService } from '../../services/documentService';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');

  const fetchDocs = () => {
    setDocuments(documentService.getAll() || []);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleAction = (doc, status) => {
    setSelectedDoc(doc);
    setTargetStatus(status);
  };

  const executeUpdate = () => {
    if (selectedDoc) {
      documentService.updateStatus(selectedDoc.id, targetStatus);
      fetchDocs();
    }
    setSelectedDoc(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Document Verification</h1>
          <p className="text-muted small">Verify submitted credentials, clearance forms, and official requests.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Doc ID</th>
                  <th>Student</th>
                  <th>Document Name</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="fw-semibold">{doc.id}</td>
                      <td>{doc.studentName || doc.studentId}</td>
                      <td>{doc.name || doc.documentType}</td>
                      <td>{doc.dateUploaded || doc.date}</td>
                      <td><StatusBadge status={doc.status} /></td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-success" 
                            onClick={() => handleAction(doc, 'Verified')}
                          >
                            Verify
                          </button>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={() => handleAction(doc, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No documents pending verification.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedDoc && (
        <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Confirm Verification Action</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDoc(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-0">
                  Mark document <strong>{selectedDoc.name || selectedDoc.id}</strong> as <strong>"{targetStatus}"</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(null)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={executeUpdate}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;