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
    attachment: null
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({});

  const purposeOptions = [
    { value: 'Scholarship Application', label: 'Scholarship Application' },
    { value: 'Transfer to another School', label: 'Transfer to another School' },
    { value: 'Employment', label: 'Employment' },
    { value: 'Board Examination', label: 'Board Examination' },
    { value: 'Other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'file' ? files[0] : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.purpose) newErrors.purpose = 'Please select a purpose.';
    if (formData.copies < 1 || formData.copies > 5) newErrors.copies = 'Copies must be between 1 and 5.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulated submission log
    console.log("Good Moral Request Submitted:", {
      studentId: CURRENT_STUDENT_ID,
      ...formData,
      attachmentName: formData.attachment ? formData.attachment.name : 'None'
    });

    setSuccessMsg('Your request for a Certificate of Good Moral Character has been submitted and is pending review.');
    setFormData({ purpose: '', copies: 1, notes: '', attachment: null });
    // Reset file input manually
    document.getElementById('attachment').value = '';
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Request Certificate of Good Moral Character</h3>
      
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <Card title="Request Details">
            <form onSubmit={handleSubmit}>
              <SelectInput 
                label="Purpose of Request" 
                name="purpose" 
                options={purposeOptions} 
                value={formData.purpose} 
                onChange={handleChange} 
                error={errors.purpose}
              />
              <FormInput 
                label="Number of Copies" 
                name="copies" 
                type="number"
                min="1"
                max="5"
                value={formData.copies} 
                onChange={handleChange} 
                error={errors.copies}
                helpText="Maximum of 5 copies per request."
              />
              <FileUpload 
                label="Supporting Document (Optional)" 
                name="attachment" 
                accept=".pdf,.jpg,.png"
                onChange={handleChange} 
                helpText="Attach requirements like clearance forms or ID if requested by OGC."
              />
              <FormInput 
                label="Additional Notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Specific instructions or routing requests..."
              />
              <div className="text-end mt-4">
                <Button type="submit" variant="primary">Submit Request</Button>
              </div>
            </form>
          </Card>
        </div>
        <div className="col-lg-4">
          <Card className="bg-light">
            <h6 className="fw-bold">Processing Information</h6>
            <ul className="small text-muted mb-0 ps-3">
              <li className="mb-2">Standard processing time is 3-5 working days.</li>
              <li className="mb-2">Ensure you have no pending disciplinary cases.</li>
              <li>You will receive a notification when your certificate is ready for pickup at the OGC.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoodMoralRequest;