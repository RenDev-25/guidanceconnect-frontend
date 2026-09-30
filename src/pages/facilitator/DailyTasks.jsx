import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { REQUEST_STATUSES } from '../../constants/statusFlow';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Pull requests that need immediate attention
    const pendingRequests = (requestService.getAll() || [])
      .filter(req => req.status === REQUEST_STATUSES.PENDING)
      .map(req => ({
        id: req.id,
        taskType: 'Request Review',
        description: `Review ${req.type} for ${req.studentName}`,
        priority: 'High',
        status: req.status,
        rawType: 'request'
      }));

    // Pull today's appointments
    const todaysAppointments = (appointmentService.getAll() || [])
      .filter(appt => appt.date === today && appt.status !== 'Completed')
      .map(appt => ({
        id: appt.id,
        taskType: 'Appointment',
        description: `Meeting with ${appt.studentName} at ${appt.time}`,
        priority: 'Normal',
        status: appt.status,
        rawType: 'appointment'
      }));

    // Combine and sort (High priority first)
    const combinedTasks = [...pendingRequests, ...todaysAppointments].sort((a, b) => 
      a.priority === 'High' ? -1 : 1
    );

    setTasks(combinedTasks);
  }, []);

  const columns = [
    { key: 'taskType', label: 'Task Type' },
    { key: 'description', label: 'Description' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (item) => (
        <span className={`text-sm font-medium ${item.priority === 'High' ? 'text-red-600' : 'text-gray-600'}`}>
          {item.priority}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Current Status',
      render: (item) => <StatusBadge status={item.status} /> 
    },
    {
      key: 'action',
      label: 'Action',
      render: (item) => (
        <Button 
          variant="secondary" 
          size="small" 
          onClick={() => console.log(`Handle ${item.rawType}:`, item.id)}
        >
          Process
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Daily Tasks & Queue</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  );
};

export default DailyTasks;