
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import FileUpload from '../../components/common/FileUpload';

const CURRENT_STUDENT_ID = 'STU-001';

const GoodMoralRequest = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    copies: 1,
    notes: '',
    attachment: null,
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [attachmentInputKey, setAttachmentInputKey] = useState(0);

  const purposeOptions = [
    {
      value: 'Scholarship Application',
      label: 'Scholarship Application',
    },
    {
      value: 'Transfer to another School',
      label: 'Transfer to another School',
    },
    { value: 'Employment', label: 'Employment' },
    {
      value: 'Board Examination',
      label: 'Board Examination',
    },
    { value: 'Other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    const updatedValue =
      type === 'file'
        ? files?.[0] || null
        : type === 'number'
          ? value === ''
            ? ''
            : Number(value)
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setSuccessMsg('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose.';
    }

    if (
      formData.copies === '' ||
      !Number.isFinite(Number(formData.copies)) ||
      Number(formData.copies) < 1 ||
      Number(formData.copies) > 5
    ) {
      newErrors.copies =
        'Copies must be between 1 and 5.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Simulated submission: preserves the existing behavior.
    console.log('Good Moral Request Submitted:', {
      studentId: CURRENT_STUDENT_ID,
      ...formData,
      attachmentName: formData.attachment
        ? formData.attachment.name
        : 'None',
    });

    setSuccessMsg(
      'Your request for a Certificate of Good Moral Character has been submitted and is pending review.'
    );

    setFormData({
      purpose: '',
      copies: 1,
      notes: '',
      attachment: null,
    });

    setErrors({});
    setAttachmentInputKey((prev) => prev + 1);
  };

  return (
    <div className="container-fluid py-3 py-md-4 px-3 px-md-4">
      <h3 className="fw-bold mb-4">
        Request Certificate of Good Moral Character
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
          <Card title="Request Details">
            <form onSubmit={handleSubmit}>
              <SelectInput
                label="Purpose of Request"
                name="purpose"
                options={purposeOptions}
                value={formData.purpose}
                onChange={handleChange}
                error={errors.purpose}
                required
              />

              <FormInput
                label="Number of Copies"
                name="copies"
                type="number"
                min="1"
                max="5"
                step="1"
                value={formData.copies}
                onChange={handleChange}
                error={errors.copies}
                helpText="Maximum of 5 copies per request."
                required
              />

              <FileUpload
                key={attachmentInputKey}
                label="Supporting Document (Optional)"
                name="attachment"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                helpText="Attach requirements like clearance forms or ID if requested by OGC."
              />

              {formData.attachment && (
                <p className="small text-muted mt-n2 mb-3">
                  Selected file: {formData.attachment.name}
                </p>
              )}

              <FormInput
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Specific instructions or routing requests..."
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
              Processing Information
            </h6>

            <ul className="small text-muted mb-0 ps-3">
              <li className="mb-2">
                Standard processing time is 3–5 working days.
              </li>
              <li className="mb-2">
                Ensure you have no pending disciplinary cases.
              </li>
              <li>
                You will receive a notification when your
                certificate is ready for pickup at the OGC.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoodMoralRequest;
