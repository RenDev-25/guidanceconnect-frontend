
import React, { useId } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
}) => {
  const titleId = useId();

  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex="-1"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1055,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        style={{
          width: '100%',
          maxWidth: '700px',
          margin: '0.5rem auto',
        }}
      >
        <div
          className="modal-content shadow"
          style={{
            minWidth: 0,
            maxWidth: '100%',
            overflowWrap: 'anywhere',
          }}
        >
          {/* Modal Header */}
          <div className="modal-header border-bottom">
            <h5
              id={titleId}
              className="modal-title fw-bold me-3"
              style={{
                minWidth: 0,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </h5>

            <button
              type="button"
              className="btn-close flex-shrink-0"
              onClick={onClose}
              aria-label="Close dialog"
            />
          </div>

          {/* Scrollable Modal Body */}
          <div
            className="modal-body"
            style={{
              minWidth: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </div>

          {/* Modal Footer */}
          {footerActions && (
            <div
              className="modal-footer border-top bg-light"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {footerActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
