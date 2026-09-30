import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { REQUEST_STATUSES } from '../../constants/statusFlow';

const FacilitatorDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    docsToVerify: 0,
    appointmentsToday: 0,
    walkIns: 0,
  });
  const [priorityRequests, setPriorityRequests] = useState([]);

  useEffect(() => {
    // Fetch data
    const allRequests = requestService.getAll() || [];
    const allAppointments = appointmentService.getAll() || [];
    
    // Calculate Stats
    const pendingReqs = allRequests.filter(req => req.status === REQUEST_STATUSES.PENDING);
    const docsVerifying = allRequests.filter(req => req.hasDocuments && req.status === REQUEST_STATUSES.IN_PROGRESS);
    
    const today = new Date().toISOString().split('T')[0];
    const todaysAppts = allAppointments.filter(appt => appt.date === today);
    const walkInsWaiting = allAppointments.filter(appt => appt.type === 'Walk-in' && appt.status === 'Waiting');

    setStats({
      pending: pendingReqs.length,
      docsToVerify: docsVerifying.length,
      appointmentsToday: todaysAppts.length,
      walkIns: walkInsWaiting.length,
    });

    // Populate Mini DataTable (Show top 5 pending requests)
    setPriorityRequests(pendingReqs.slice(0, 5));
  }, []);

  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'type', label: 'Type' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (item) => <StatusBadge status={item.status} /> 
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Facilitator Dashboard</h1>
      
      {/* Workload Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={stats.pending} icon="clock" color="bg-yellow-100 text-yellow-800" />
        <StatCard title="Docs to Verify" value={stats.docsToVerify} icon="document" color="bg-blue-100 text-blue-800" />
        <StatCard title="Today's Appointments" value={stats.appointmentsToday} icon="calendar" color="bg-green-100 text-green-800" />
        <StatCard title="Walk-ins Waiting" value={stats.walkIns} icon="users" color="bg-purple-100 text-purple-800" />
      </div>

      {/* Priority Action Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Action Needed: Pending Requests</h2>
        <DataTable 
          columns={columns} 
          data={priorityRequests} 
          onRowClick={(row) => console.log('Navigate to request details:', row.id)} 
        />
      </div>
    </div>
  );
};

export default FacilitatorDashboard;