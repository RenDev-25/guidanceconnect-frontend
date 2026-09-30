import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { studentService } from '../../services/studentService';

const StudentRecords = () => {
  const [students, setStudents] = useState([]);
  const [programFilter, setProgramFilter] = useState('');

  useEffect(() => {
    const data = studentService.getAll() || [];
    setStudents(data);
  }, []);

  const filteredStudents = programFilter 
    ? students.filter(s => s.program === programFilter)
    : students;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Student Directory & Profiles</h1>
          <p className="text-muted small">Read-only student profile lookup and academic status tracking.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <select 
                className="form-select form-select-sm"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="BSEd">BSEd</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Program</th>
                  <th>Year Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td className="fw-semibold">{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.program}</td>
                      <td>{s.yearLevel || '2nd Year'}</td>
                      <td><StatusBadge status={s.status || 'Active'} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No student records match the selected filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRecords;