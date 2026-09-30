import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { appointmentService } from '../../services/appointmentService';

const WalkInQueue = () => {
  const [queue, setQueue] = useState([]);
  const [currentlyServing, setCurrentlyServing] = useState(null);
  
  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', message: '', action: null });

  const fetchWalkIns = () => {
    const allAppts = appointmentService.getAll() || [];
    
    // Get today's date in YYYY-MM-DD local format
    const today = new Date().toISOString().split('T')[0];
    
    // Filter for today's walk-ins (assuming your mock data uses type="Walk-in" or similar)
    const todaysWalkIns = allAppts.filter(a => 
      a.date === today && 
      (a.type?.toLowerCase().includes('walk-in') || a.isWalkIn) &&
      a.status !== 'Cancelled' &&
      a.status !== 'No-Show'
    );

    // Identify who is currently being served
    const serving = todaysWalkIns.find(a => a.status === 'In Progress');
    setCurrentlyServing(serving || null);

    // Filter the rest for the waiting queue
    const waiting = todaysWalkIns.filter(a => a.status === 'Pending' || a.status === 'Waiting');
    // Assuming chronological order or creation order
    setQueue(waiting);
  };

  useEffect(() => {
    fetchWalkIns();
    // Optional: Add a setInterval here to poll for new walk-ins every 30 seconds
  }, []);

  const triggerCallNext = () => {
    if (queue.length === 0) return;
    
    setDialogConfig({
      title: 'Call Next Student',
      message: `This will mark the current student as Completed (if any) and call ${queue[0].studentName}. Proceed?`,
      action: () => {
        // 1. Complete current student if exists
        if (currentlyServing) {
          appointmentService.updateStatus(currentlyServing.id, 'Completed');
        }
        // 2. Move next student to 'In Progress'
        appointmentService.updateStatus(queue[0].id, 'In Progress');
        fetchWalkIns();
        setDialogOpen(false);
      }
    });
    setDialogOpen(true);
  };

  const triggerCompleteCurrent = () => {
    if (!currentlyServing) return;

    setDialogConfig({
      title: 'Complete Session',
      message: `Mark ${currentlyServing.studentName}'s session as Completed?`,
      action: () => {
        appointmentService.updateStatus(currentlyServing.id, 'Completed');
        fetchWalkIns();
        setDialogOpen(false);
      }
    });
    setDialogOpen(true);
  };

  const columns = [
    { 
      key: 'queueNum', 
      label: 'Queue #',
      render: (_, index) => <span className="font-bold text-gray-700">#{index + 1}</span>
    },
    { key: 'studentName', label: 'Student Name' },
    { key: 'time', label: 'Time Arrived' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => <StatusBadge status={item.status || 'Waiting'} /> 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Live Walk-In Queue</h1>
        <Button 
          variant="primary" 
          onClick={triggerCallNext}
          disabled={queue.length === 0}
        >
          Call Next in Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Currently Serving */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] shadow-sm">
            <h2 className="text-blue-800 font-bold uppercase tracking-wider text-sm mb-2">Currently Serving</h2>
            {currentlyServing ? (
              <div className="text-center space-y-4">
                <p className="text-3xl font-extrabold text-blue-900">{currentlyServing.studentName}</p>
                <p className="text-blue-700">Arrived: {currentlyServing.time}</p>
                <Button variant="secondary" size="small" onClick={triggerCompleteCurrent}>
                  Mark Completed
                </Button>
              </div>
            ) : (
              <div className="text-center text-blue-600">
                <p className="text-xl font-medium">No one currently serving</p>
                <p className="text-sm mt-2">Click 'Call Next' to bring in the first student.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Waiting Queue */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[250px]">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Waiting Area</h2>
            {queue.length > 0 ? (
              <DataTable columns={columns} data={queue} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                The walk-in queue is currently empty.
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={dialogConfig.action}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default WalkInQueue;