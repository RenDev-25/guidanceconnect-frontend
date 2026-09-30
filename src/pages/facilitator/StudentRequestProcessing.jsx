import React, { useState, useEffect } from 'react';

import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import { requestService } from '../../services/requestService';
import {
  REQUEST_STATUSES,
  canTransition,
} from '../../constants/statusFlow';

const StudentRequestProcessing = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null);

  const fetchRequests = () => {
    const allRequests = requestService.getAll() || [];

    const processable = allRequests.filter(
      (request) =>
        request.status !== REQUEST_STATUSES.COMPLETED &&
        request.status !== REQUEST_STATUSES.REJECTED
    );

    setRequests(processable);
    setFilteredRequests(processable);
    setSelectedIds([]);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();

      result = result.filter(
        (request) =>
          request.id?.toLowerCase().includes(term) ||
          request.studentId?.toLowerCase().includes(term) ||
          request.serviceType?.toLowerCase().includes(term)
      );
    }

    if (filters.type) {
      result = result.filter(
        (request) => request.serviceType === filters.type
      );
    }

    setFilteredRequests(result);
  }, [filters, requests]);

  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  };

  const handleBatchActionClick = (statusAction) => {
    if (selectedIds.length === 0) return;

    setTargetAction(statusAction);
    setDialogOpen(true);
  };

  const executeBatchAction = () => {
    const validUpdates = selectedIds.filter((id) => {
      const request = requests.find(
        (item) => item.id === id
      );

      return (
        request &&
        canTransition(request.status, targetAction)
      );
    });

    validUpdates.forEach((id) => {
      requestService.updateStatus(
        id,
        targetAction
      );
    });

    setDialogOpen(false);
    setTargetAction(null);

    fetchRequests();
  };

  const columns = [
    {
      key: 'select',
      label: 'Select',
      renderCell: (row) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelection(row.id)}
        />
      ),
    },

    {
      key: 'id',
      label: 'Request ID',
    },

    {
      key: 'studentId',
      label: 'Student ID',
    },

    {
      key: 'serviceType',
      label: 'Service Type',
    },

    {
      key: 'status',
      label: 'Status',
      renderCell: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  const typeOptions = [
    {
      value: '',
      label: 'All Service Types',
    },
    {
      value: 'Individual Counseling',
      label: 'Individual Counseling',
    },
    {
      value: 'Good Moral Certificate',
      label: 'Good Moral Certificate',
    },
    {
      value: 'Career Guidance',
      label: 'Career Guidance',
    },
    {
      value: 'Clearance Signing',
      label: 'Clearance Signing',
    },
  ];

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Batch Request Processing
        </h2>

        <p className="text-muted mb-0">
          Select multiple requests and perform valid
          status updates at once.
        </p>
      </div>

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          {/* Toolbar */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <FilterBar
              onSearch={(value) =>
                setFilters((previous) => ({
                  ...previous,
                  search: value,
                }))
              }
              onFilterChange={(value) =>
                setFilters((previous) => ({
                  ...previous,
                  type: value,
                }))
              }
              filterOptions={typeOptions}
              searchPlaceholder="Search request ID, student ID, or service..."
            />

            <div className="d-flex gap-2">

              <Button
                variant="secondary"
                disabled={selectedIds.length === 0}
                onClick={() =>
                  handleBatchActionClick(
                    REQUEST_STATUSES.IN_PROGRESS
                  )
                }
              >
                Mark In Progress
              </Button>

              <Button
                variant="primary"
                disabled={selectedIds.length === 0}
                onClick={() =>
                  handleBatchActionClick(
                    REQUEST_STATUSES.APPROVED
                  )
                }
              >
                Approve Selected
              </Button>

            </div>
          </div>

          {/* Request Table */}
          <DataTable
            columns={columns}
            data={filteredRequests}
          />

        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialogOpen}
        title="Confirm Batch Update"
        message={`Are you sure you want to change the status of ${selectedIds.length} selected request(s) to "${targetAction}"? Requests that cannot legally transition to this status will not be changed.`}
        onConfirm={executeBatchAction}
        onCancel={() => {
          setDialogOpen(false);
          setTargetAction(null);
        }}
      />

    </div>
  );
};

export default StudentRequestProcessing;