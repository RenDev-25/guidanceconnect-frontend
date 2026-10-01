import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { userService } from '../../services/userService';
import { auditLogService } from '../../services/auditLogService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Counselor',
    department: 'CICS',
    status: 'Active'
  });

  const fetchUsers = () => setUsers(userService.getAll() || []);

  useEffect(() => fetchUsers(), []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Counselor',
        department: 'CICS',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };

    if (editingUser) {
      userService.update(editingUser.id, formData);
      auditLogService.log(currentUser.id, `Updated user profile and permissions for ${formData.email}`);
    } else {
      userService.create(formData);
      auditLogService.log(currentUser.id, `Created new user account for ${formData.email} (${formData.role})`);
    }

    setShowModal(false);
    fetchUsers();
  };

  const handleToggleStatus = (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    userService.update(user.id, { status: newStatus });
    auditLogService.log(currentUser.id, `Changed account status of ${user.email} to ${newStatus}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(u => filterRole === 'All' || u.role === filterRole);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">User Management</h1>
          <p className="text-muted small mb-0">Manage system access, assign roles, and activate or deactivate user accounts.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          + Add New User
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="d-flex gap-2">
            {['All', 'Admin', 'Counselor', 'Facilitator', 'Student'].map(role => (
              <button
                key={role}
                className={`btn btn-sm ${filterRole === role ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department / College</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="fw-semibold">{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'bg-danger' : u.role === 'Counselor' ? 'bg-primary' : u.role === 'Facilitator' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.department || 'N/A'}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenModal(u)}>
                        Edit
                      </button>
                      <button 
                        className={`btn btn-sm ${u.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingUser ? 'Edit User' : 'Create User'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Role</label>
                      <select 
                        className="form-select" 
                        value={formData.role} 
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Counselor">Counselor</option>
                        <option value="Facilitator">Facilitator</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department / College</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.department} 
                        onChange={e => setFormData({ ...formData, department: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">{editingUser ? 'Save Changes' : 'Create User'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;