
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
    const timer = setTimeout(() => {
      setServices(serviceService.getActiveServices() || []);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
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
      notes: notes,
    });

    setSuccessMsg(
      `Successfully requested: ${selectedService.name}`
    );

    handleCloseModal();
  };

  if (loading) {
    return (
      <LoadingState message="Loading available services..." />
    );
  }

  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={handleCloseModal}
      >
        Cancel
      </Button>

      <Button
        variant="primary"
        onClick={handleSubmitRequest}
      >
        Submit Request
      </Button>
    </>
  );

  return (
    <div className="container-fluid py-3 py-md-4 px-3 px-md-4">
      <h3 className="fw-bold mb-4">
        Request a Service
      </h3>

      {successMsg && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i
            className="bi bi-check-circle-fill me-2"
            aria-hidden="true"
          />

          {successMsg}

          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss success message"
            onClick={() => setSuccessMsg('')}
          />
        </div>
      )}

      {services.length === 0 ? (
        <EmptyState
          message="No active services available at the moment."
        />
      ) : (
        <div className="row g-3 g-md-4">
          {services.map((service) => (
            <div
              className="col-12 col-sm-6 col-xl-4"
              key={service.id}
            >
              <Card className="h-100 d-flex flex-column">
                <div className="flex-grow-1">
                  <h5 className="fw-bold text-primary">
                    {service.name}
                  </h5>

                  <p className="text-muted small mb-3">
                    {service.description}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-top">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleOpenModal(service)}
                  >
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
            <p>
              You are about to request:{' '}
              <strong>{selectedService.name}</strong>
            </p>

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
