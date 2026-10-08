import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from 'recharts';
import Card from './Card';

// ==========================================
// OGC DESIGN SYSTEM COLOR PALETTE
// ==========================================
export const OGC_COLORS = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  success: '#198754',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#0dcaf0',
  purple: '#6f42c1',
  orange: '#fd7e14',
  teal: '#20c997',
  indigo: '#6610f2',
};

// Sequential array for Pie/Donut charts or multi-series bars
export const CHART_PALETTE = [
  OGC_COLORS.primary,
  OGC_COLORS.success,
  OGC_COLORS.warning,
  OGC_COLORS.info,
  OGC_COLORS.purple,
  OGC_COLORS.orange,
  OGC_COLORS.teal,
  OGC_COLORS.danger,
];

// ==========================================
// REUSABLE CUSTOM RECHARTS TOOLTIP
// ==========================================
export const CustomChartTooltip = ({ active, payload, label, formatter, valueSuffix = '' }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border rounded shadow-sm p-2 px-3 small" style={{ minWidth: '140px' }}>
      {label && <div className="fw-bold text-dark mb-1 pb-1 border-bottom">{label}</div>}
      <div className="d-flex flex-column gap-1">
        {payload.map((entry, index) => {
          const formattedValue = formatter ? formatter(entry.value) : entry.value;
          return (
            <div key={`item-${index}`} className="d-flex align-items-center justify-content-between gap-3">
              <span className="d-flex align-items-center gap-1 text-muted">
                <span
                  className="d-inline-block rounded-circle"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: entry.color || entry.fill || OGC_COLORS.primary,
                  }}
                />
                {entry.name}:
              </span>
              <span className="fw-semibold text-dark">
                {formattedValue}
                {valueSuffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CustomChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formatter: PropTypes.func,
  valueSuffix: PropTypes.string,
};

// ==========================================
// CHART CONTAINER COMPONENT
// ==========================================
export const ChartContainer = ({
  title,
  subtitle,
  children,
  height = 320,
  loading = false,
  isEmpty = false,
  emptyMessage = 'No data available for the selected filters.',
  headerActions = null,
  className = '',
}) => {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      className={`h-100 ${className}`}
    >
      <div
        className="w-100 position-relative d-flex align-items-center justify-content-center"
        style={{ minHeight: `${height}px` }}
      >
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading chart...</span>
            </div>
            <small className="text-muted fw-semibold">Loading chart data...</small>
          </div>
        ) : isEmpty ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center px-3">
            <div className="bg-light p-3 rounded-circle text-muted mb-2">
              <i className="bi bi-bar-chart fs-3" />
            </div>
            <p className="text-muted small mb-0">{emptyMessage}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  headerActions: PropTypes.node,
  className: PropTypes.string,
};

export default ChartContainer;