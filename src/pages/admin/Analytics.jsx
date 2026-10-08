import React, { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaClipboardList
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

import { analyticsService } from '../../services/analyticsService';
import DashboardGrid from '../../components/dashboard/DashboardGrid';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';
import DataTable from '../../components/common/DataTable';
import ChartContainer, { OGC_COLORS, CHART_PALETTE, CustomChartTooltip } from '../../components/common/ChartContainer';

const Analytics = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    serviceType: 'all',
    appointmentMode: 'all',
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = analyticsService.getAnalyticsData(filters);
      setData(result);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      serviceType: 'all',
      appointmentMode: 'all',
    });
  };

  // Columns for the Backlog Data Table
  const backlogColumns = [
    { key: 'service', label: 'Service Type' },
    { key: 'completed', label: 'Completed' },
    { 
      key: 'pending', 
      label: 'Pending / Active',
      renderCell: (row) => (
        <span className={row.pending > 0 ? "text-danger fw-semibold" : ""}>
          {row.pending}
        </span>
      )
    },
    { key: 'total', label: 'Total Requests', renderCell: (row) => <span className="fw-bold">{row.total}</span> }
  ];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <FaChartLine className="text-primary me-2" />
            Descriptive Analytics
          </h1>
          <p className="text-muted mb-0">
            Insights and operational metrics for the Guidance and Counseling Office.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="mb-4 bg-light border-0 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label text-muted small fw-semibold mb-1">Start Date</label>
            <input type="date" className="form-control form-control-sm" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label text-muted small fw-semibold mb-1">End Date</label>
            <input type="date" className="form-control form-control-sm" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label text-muted small fw-semibold mb-1">Service Type</label>
            <select className="form-select form-select-sm" name="serviceType" value={filters.serviceType} onChange={handleFilterChange}>
              <option value="all">All Services</option>
              <option value="Counseling">Counseling</option>
              <option value="Good Moral">Good Moral</option>
              <option value="Routine Interview">Routine Interview</option>
            </select>
          </div>
          <div className="col-12 col-md-3 d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary w-100" onClick={clearFilters} title="Clear Filters">
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {loading || !data ? (
        <LoadingState message="Aggregating analytics data..." />
      ) : (
        <>
          {/* KPI Stat Cards */}
          <DashboardGrid>
            <StatCard title="Total Requests" value={data.kpis.totalRequests.toLocaleString()} subtitle="For selected period" icon={<FaClipboardList size={22} />} borderTheme="primary" />
            <StatCard title="Completion Rate" value={`${data.kpis.completionRate}%`} subtitle="Requests fully resolved" icon={<FaCheckCircle size={22} />} borderTheme="success" />
            <StatCard title="Avg. Processing Time" value={data.kpis.averageProcessingDays !== null ? `${data.kpis.averageProcessingDays} Days` : 'N/A'} subtitle="From submission to completion" icon={<FaClock size={22} />} borderTheme="warning" />
            <StatCard title="Total Appointments" value={data.summary.appointments.total.toLocaleString()} subtitle="Across all modalities" icon={<FaCalendarAlt size={22} />} borderTheme="info" />
          </DashboardGrid>

          {/* ROW 1: Volume Trend & Delivery Mode Split */}
          <div className="row g-4 mb-4 mt-1">
            <div className="col-12 col-xl-8">
              <ChartContainer 
                title="Request Volume Trend" 
                subtitle="Historical demand for services over time"
                isEmpty={data.requestTrend.length === 0}
              >
                <LineChart data={data.requestTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line type="monotone" dataKey="requests" name="Total Requests" stroke={OGC_COLORS.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ChartContainer>
            </div>
            <div className="col-12 col-xl-4">
              <ChartContainer 
                title="Delivery Mode Split" 
                subtitle="Online vs. Face-to-Face Preference"
                isEmpty={data.counselingModeBreakdown.length === 0}
              >
                <PieChart>
                  <Pie data={data.counselingModeBreakdown} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.counselingModeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name.includes('Online') ? OGC_COLORS.info : OGC_COLORS.primary} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          {/* ROW 2: Bar Charts (Service Breakdown & Appointments) */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-6">
              <ChartContainer 
                title="Requests by Service Type" 
                subtitle="Most and least requested OGC services"
                isEmpty={data.requestsByService.length === 0}
              >
                <BarChart data={data.requestsByService} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="value" name="Total Requests" fill={OGC_COLORS.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="col-12 col-lg-6">
              <ChartContainer 
                title="Appointment Reliability" 
                subtitle="Status breakdown of scheduled meetings"
                isEmpty={data.appointmentStatusBreakdown.length === 0}
              >
                <BarChart data={data.appointmentStatusBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6c757d' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="value" name="Appointments" radius={[4, 4, 0, 0]}>
                    {data.appointmentStatusBreakdown.map((entry, index) => {
                      // Dynamically color bars based on status context
                      let color = OGC_COLORS.secondary;
                      if (entry.name === 'Completed') color = OGC_COLORS.success;
                      if (entry.name === 'No-show') color = OGC_COLORS.danger;
                      if (entry.name === 'Cancelled') color = OGC_COLORS.warning;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* ROW 3: Good Moral Pie & Backlog Data Table */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-xl-4">
              <ChartContainer 
                title="Good Moral Requests" 
                subtitle="Primary purpose breakdown"
                isEmpty={data.goodMoralPurposeBreakdown.length === 0}
              >
                <PieChart>
                  <Pie data={data.goodMoralPurposeBreakdown} outerRadius={80} dataKey="value">
                    {data.goodMoralPurposeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ChartContainer>
            </div>

            <div className="col-12 col-xl-8">
              <Card 
                title="Operational Backlog Detail" 
                subtitle="Completed vs active requests per service"
                className="h-100"
              >
                {data.serviceBacklog.length === 0 ? (
                  <div className="text-center text-muted py-5">No service data found.</div>
                ) : (
                  <DataTable 
                    columns={backlogColumns} 
                    data={data.serviceBacklog} 
                    keyField="service" 
                  />
                )}
              </Card>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Analytics;