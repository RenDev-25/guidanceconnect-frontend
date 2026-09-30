import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { requestService } from '../../services/requestService';
import { ALLOWED_TRANSITIONS } from '../../constants/statusFlow';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [notes, setNotes] = useState('');
  
  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');

  useEffect(() => {
    const data = requestService.getById(id);
    if (data) {
      setRequest(data);
      setNotes(data.notes || '');
    }
  }, [id]);

  const handleStatusChangeClick = (status) => {
    setTargetStatus(status);
    setDialogOpen(true);
  };

  const executeStatusChange = () => {
    if (request) {
      // In a real app, we'd save the notes here too: requestService.update(id, { status: targetStatus, notes })
      const updated = requestService.updateStatus(id, targetStatus);
      setRequest(updated);
    }
    setDialogOpen(false);
  };

  if (!request) {
    return <div className="p-6">Loading request details...</div>;
  }

  // Determine which buttons to show based on current status
  const availableActions = ALLOWED_TRANSITIONS[request.status] || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/facilitator/requests')}>
            &larr; Back to Queue
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Request {request.id}</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Student Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{request.studentName}</p>
              </div>
              <div>
                <p className="text-gray-500">Student ID</p>
                <p className="font-medium">{request.studentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Program</p>
                <p className="font-medium">{request.program || 'N/A'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Request Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Service Type</p>
                <p className="font-medium">{request.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Date Submitted</p>
                <p className="font-medium">{request.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Description / Reason</p>
                <p className="mt-1 bg-gray-50 p-3 rounded border">{request.description || 'No description provided.'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions & Notes */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Facilitator Actions</h2>
            <div className="space-y-3">
              {availableActions.length > 0 ? (
                availableActions.map(action => (
                  <Button 
                    key={action}
                    variant={action === 'Rejected' ? 'secondary' : 'primary'}
                    className="w-full justify-center"
                    onClick={() => handleStatusChangeClick(action)}
                  >
                    Mark as {action}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No further actions available for this status.</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Internal Notes</h2>
            <textarea
              className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Add internal notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button variant="secondary" size="small" className="w-full mt-3 justify-center">
              Save Note
            </Button>
          </Card>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={dialogOpen}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of this request to "${targetStatus}"?`}
        onConfirm={executeStatusChange}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default RequestDetails;