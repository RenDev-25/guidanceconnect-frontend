import React, { useState } from 'react';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/FileUpload';
import SelectInput from '../../components/common/SelectInput';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    requestId: '',
    file: null
  });
  const [successMsg, setSuccessMsg] = useState('');
  
  
  const [uploadedDocs, setUploadedDocs] = useState([
    { id: 'DOC-001', fileName: 'Clearance_Form.pdf', relatedRequest: 'REQ-002', uploadDate: '2026-09-25', status: 'Verified' },
    { id: 'DOC-002', fileName: 'ID_Copy.jpg', relatedRequest: 'REQ-005', uploadDate: '2026-09-27', status: 'Pending Verification' }
  ]);

  // Mock list of active requests the student might need to attach files to
  const activeRequests = [
    { value: 'REQ-002', label: 'REQ-002: Good Moral Certificate' },
    { value: 'REQ-005', label: 'REQ-005: Routine Interview' }
  ];

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file || !formData.requestId) return;

    // Simulate uploading
    const newDoc = {
      id: `DOC-00${uploadedDocs.length + 1}`,
      fileName: formData.file.name,
      relatedRequest: formData.requestId,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending Verification'
    };

    setUploadedDocs([newDoc, ...uploadedDocs]);
    setSuccessMsg(`File "${formData.file.name}" uploaded successfully!`);
    setFormData({ requestId: '', file: null });
    
    // Clear input
    document.getElementById('docFile').value = '';
    
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const columns = [
    { key: 'fileName', label: 'File Name' },
    { key: 'relatedRequest', label: 'Related Request' },
    { key: 'uploadDate', label: 'Upload Date' },
    { key: 'status', label: 'Status', renderCell: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Document Upload</h3>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-4 mb-4">
          <Card title="Upload New Document">
            <form onSubmit={handleSubmit}>
              <SelectInput f
                label="Attach to Request"
                name="requestId"
                value={formData.requestId}
                onChange={(e) => setFormData(prev => ({ ...prev, requestId: e.target.value }))}
                options={activeRequests}
              />
              
              <FileUpload 
                label="Select File"
                name="docFile"
                id="docFile"
                accept=".pdf,.jpg,.png,.doc,.docx"
                onChange={handleFileChange}
                helpText="Max file size: 5MB"
              />

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 mt-3"
                disabled={!formData.file || !formData.requestId}
              >
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Upload File
              </Button>
            </form>
          </Card>
        </div>

        <div className="col-lg-8">
          <Card title="My Uploaded Documents">
            <DataTable columns={columns} data={uploadedDocs} keyField="id" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;