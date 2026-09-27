
import Modal from './Modal';
import Button from './Button';

/**
 * Destructive/Important action confirmation dialog
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} props.title
 * @param {string} props.message
 * @param {string} [props.confirmText='Confirm']
 * @param {string} [props.confirmVariant='danger'] - Usually danger for deletion, or success for approvals
 */
const ConfirmDialog = ({ 
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' 
}) => {
  
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footerActions={footer}>
      <p className="mb-0 text-secondary">{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;