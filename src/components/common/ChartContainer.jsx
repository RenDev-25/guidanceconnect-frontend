import React from 'react';
import Card from './Card';

/**
 * Wrapper for analytics charts to maintain consistent heights and borders
 * @param {Object} props
 * @param {string} props.title
 * @param {React.ReactNode} [props.actions] - Dropdowns or filters for the chart
 */
const ChartContainer = ({ title, actions, children }) => {
  return (
    <Card title={title} headerActions={actions}>
      <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        {children ? children : (
          <span className="text-muted fst-italic">Chart visualization will render here</span>
        )}
      </div>
    </Card>
  );
};

export default ChartContainer;