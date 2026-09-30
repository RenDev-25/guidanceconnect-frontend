import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { documentService } from '../../services/documentService';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  
  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [targetAction, setTargetAction] = useState(''); // 'Verified' or 'Rejected'

  const fetchDocuments = () => {
    // In a real app, you might fetch docs linked to requests that are 'In Progress'
    const allDocs = documentService.getAll() || [];
    // Show only pending documents for the queue
    setDocuments(allDocs.filter(doc => doc.status === 'Pending'));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleActionClick = (doc, action) => {
    setSelectedDoc(doc);
    setTargetAction(action);
    setDialogOpen(true);
  };

  const executeAction = () => {
    if (selectedDoc) {
      documentService.updateStatus(selectedDoc.id, targetAction);
      fetchDocuments(); // Refresh queue
    }
    setDialogOpen(false);
  };

  const columns = [
    { key: 'id', label: 'Doc ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'documentType', label: 'Document Type' },
    { key: 'uploadDate', label: 'Upload Date' },
    {
      key: 'view',
      label: 'Preview',
      render: (item) => (
        <a 
          href={item.fileUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          View File
        </a>
      )
    },
    {
      key: 'action',
      label: 'Verification Action',
      render: (item) => (
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="small" 
            onClick={() => handleActionClick(item, 'Verified')}
          >
            Approve
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={() => handleActionClick(item, 'Rejected')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Document Verification Queue</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {documents.length > 0 ? (
          <DataTable columns={columns} data={documents} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No pending documents require verification at this time.
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={dialogOpen}
        title={`Confirm ${targetAction}`}
        message={`Are you sure you want to mark document ${selectedDoc?.id} as ${targetAction}?`}
        onConfirm={executeAction}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default DocumentVerification;