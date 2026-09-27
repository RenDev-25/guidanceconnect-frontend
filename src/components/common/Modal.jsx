import React from 'react';

/**
 * Generic Modal Wrapper
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} [props.footerActions] - Buttons to display at the bottom
 */
const Modal = ({ isOpen, onClose, title, children, footerActions }) => {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footerActions && (
            <div className="modal-footer border-top-0 bg-light rounded-bottom">
              {footerActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;