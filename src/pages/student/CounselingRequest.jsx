
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import DatePicker from '../../components/common/DatePicker';
import { requestService } from '../../services/requestService';

const CURRENT_STUDENT_ID = 'STU-001';

const CounselingRequest = () => {
  const [formData, setFormData] = useState({
    reasonCategory: '',
    preferredMode: '',
    preferredDate: '',
    additionalNotes: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({});

  const reasonOptions = [
    { value: 'Academic Stress', label: 'Academic Stress' },
    { value: 'Career Guidance', label: 'Career Guidance' },
    {
      value: 'Personal/Family Issues',
      label: 'Personal/Family Issues',
    },
    { value: 'Other', label: 'Other' },
  ];

  const modeOptions = [
    { value: 'Face-to-Face', label: 'Face-to-Face' },
    {
      value: 'Online (Zoom/Meet)',
      label: 'Online (Zoom/Meet)',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.reasonCategory) {
      newErrors.reasonCategory = 'Please select a reason.';
    }

    if (!formData.preferredMode) {
      newErrors.preferredMode =
        'Please select a preferred mode.';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate =
        'Please select a preferred date.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    requestService.create({
      studentId: CURRENT_STUDENT_ID,
      serviceType: 'Counseling Session',
      details: formData,
    });

    setSuccessMsg(
      'Your counseling request has been submitted successfully.'
    );

    setFormData({
      reasonCategory: '',
      preferredMode: '',
      preferredDate: '',
      additionalNotes: '',
    });

    setErrors({});
  };

  return (
    <div className="container-fluid py-3 py-md-4 px-3 px-md-4">
      <h3 className="fw-bold mb-4">
        Request Counseling
      </h3>

      {successMsg && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="status"
          aria-live="polite"
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

      <div className="row g-3 g-lg-4">
        <div className="col-12 col-lg-8">
          <Card title="Session Details">
            <form onSubmit={handleSubmit}>
              <SelectInput
                label="Reason for Counseling"
                name="reasonCategory"
                options={reasonOptions}
                value={formData.reasonCategory}
                onChange={handleChange}
                error={errors.reasonCategory}
                required
              />

              <SelectInput
                label="Preferred Mode"
                name="preferredMode"
                options={modeOptions}
                value={formData.preferredMode}
                onChange={handleChange}
                error={errors.preferredMode}
                required
              />

              <DatePicker
                label="Preferred Date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                error={errors.preferredDate}
                required
              />

              <FormInput
                label="Additional Notes (Optional)"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Share anything you'd like the counselor to know beforehand..."
              />

              <div className="d-grid d-sm-flex justify-content-sm-end mt-4">
                <Button
                  type="submit"
                  variant="primary"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card className="bg-light">
            <h6 className="fw-bold">
              Confidentiality Notice
            </h6>

            <p className="small text-muted mb-0">
              All information shared in counseling sessions
              is strictly confidential. Information will only
              be disclosed with your written consent, except
              in situations where there is imminent danger
              to yourself or others.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounselingRequest;
