import React, { useState } from 'react';
import Card from '../../components/common/Card';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';

const Profile = () => {
  // Read-only institutional info + editable contact fields
  const [studentInfo] = useState({
    studentId: 'STU-001',
    name: 'Renzy',
    email: 'renzy@university.edu.ph',
    program: 'Bachelor of Science in Information Technology',
    college: 'College of Informatics and Computing Sciences',
    yearLevel: '2nd Year'
  });

  const [formData, setFormData] = useState({
    phone: '09123456789',
    personalEmail: 'renzy.personal@gmail.com',
    emergencyContactName: 'Maria Cruz',
    emergencyContactPhone: '09987654321',
    address: 'Batangas City, Philippines'
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('Contact profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Student Profile</h3>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Read-only Institutional Information */}
        <div className="col-lg-5">
          <Card title="Institutional Information">
            <div className="text-center py-3 border-bottom mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fs-3 fw-bold"
                style={{ width: '72px', height: '72px' }}
              >
                {studentInfo.name.charAt(0)}
              </div>
              <h5 className="fw-bold mb-0">{studentInfo.name}</h5>
              <small className="text-muted">{studentInfo.studentId}</small>
            </div>

            <div className="mb-2">
              <label className="text-muted small fw-semibold">University Email</label>
              <p className="fw-semibold mb-0">{studentInfo.email}</p>
            </div>
            <div className="mb-2">
              <label className="text-muted small fw-semibold">College</label>
              <p className="fw-semibold mb-0">{studentInfo.college}</p>
            </div>
            <div className="mb-2">
              <label className="text-muted small fw-semibold">Program</label>
              <p className="fw-semibold mb-0">{studentInfo.program}</p>
            </div>
            <div className="mb-0">
              <label className="text-muted small fw-semibold">Year Level</label>
              <p className="fw-semibold mb-0">{studentInfo.yearLevel}</p>
            </div>
          </Card>
        </div>

        {/* Editable Contact & Emergency Details */}
        <div className="col-lg-7">
          <Card title="Editable Contact Details">
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Mobile Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormInput
                label="Personal Email Address"
                name="personalEmail"
                type="email"
                value={formData.personalEmail}
                onChange={handleChange}
              />
              <FormInput
                label="Home Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <hr className="my-4" />
              <h6 className="fw-bold text-secondary mb-3">Emergency Contact</h6>

              <FormInput
                label="Contact Person Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
              <FormInput
                label="Contact Person Phone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />

              <div className="text-end mt-4">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;