import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { serviceService } from '../../services/serviceService';
import { requestService } from '../../services/requestService';

const CURRENT_STUDENT_ID = 'STU-001';

const ServiceRequest = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setServices(serviceService.getActiveServices() || []);
      setLoading(false);
    }, 400);
  }, []);

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setNotes('');
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSubmitRequest = () => {
    if (!selectedService) return;

    requestService.create({
      studentId: CURRENT_STUDENT_ID,
      serviceId: selectedService.id,
      serviceType: selectedService.name,
      notes: notes
    });

    setSuccessMsg(`Successfully requested: ${selectedService.name}`);
    handleCloseModal();
  };

  if (loading) return <LoadingState message="Loading available services..." />;

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmitRequest}>Submit Request</Button>
    </>
  );

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Request a Service</h3>
      
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {services.length === 0 ? (
        <EmptyState message="No active services available at the moment." />
      ) : (
        <div className="row g-4">
          {services.map(service => (
            <div className="col-md-6 col-lg-4" key={service.id}>
              <Card className="h-100 d-flex flex-column">
                <div className="flex-grow-1">
                  <h5 className="fw-bold text-primary">{service.name}</h5>
                  <p className="text-muted small mb-3">{service.description}</p>
                </div>
                <div className="mt-auto pt-3 border-top">
                  <Button variant="outline-primary" className="w-100" onClick={() => handleOpenModal(service)}>
                    Request Service
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Confirm Service Request" 
        footerActions={modalFooter}
      >
        {selectedService && (
          <div>
            <p>You are about to request: <strong>{selectedService.name}</strong></p>
            <FormInput 
              label="Additional Notes (Optional)" 
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any context for the counselor..."
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceRequest;