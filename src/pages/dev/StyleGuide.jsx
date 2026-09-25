function StyleGuide() {
  return (
    <div className="container-fluid py-4">
      <div className="gc-page-header">
        <h1 className="gc-page-title">GuidanceConnect Style Guide</h1>
        <p className="gc-page-subtitle">
          Temporary visual reference for the frontend design system.
        </p>
      </div>

      {/* Buttons */}
      <section className="mb-5">
        <h2>Buttons</h2>

        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary">
            Primary
          </button>

          <button className="btn btn-secondary-custom">
            Secondary
          </button>

          <button className="btn btn-success-custom">
            Success
          </button>

          <button className="btn btn-warning-custom">
            Warning
          </button>

          <button className="btn btn-danger-custom">
            Danger
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-5">
        <h2>Cards</h2>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="gc-card">
              <h4>Total Requests</h4>
              <h2>128</h2>
              <small className="text-muted">
                Current academic period
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="gc-card">
              <h4>Pending</h4>
              <h2>24</h2>
              <small className="text-muted">
                Requests awaiting action
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="gc-card">
              <h4>Completed</h4>
              <h2>104</h2>
              <small className="text-muted">
                Completed requests
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-5">
        <h2>Status Badges</h2>

        <div className="d-flex flex-wrap gap-2">
          <span className="gc-badge gc-badge-pending">
            Pending
          </span>

          <span className="gc-badge gc-badge-approved">
            Approved
          </span>

          <span className="gc-badge gc-badge-rejected">
            Rejected
          </span>

          <span className="gc-badge gc-badge-progress">
            In Progress
          </span>
        </div>
      </section>

      {/* Status Indicators */}
      <section className="mb-5">
        <h2>Status Indicators</h2>

        <div className="d-flex flex-column gap-2">
          <div>
            <span className="gc-status-dot gc-status-dot-success me-2"></span>
            Available
          </div>

          <div>
            <span className="gc-status-dot gc-status-dot-warning me-2"></span>
            Waiting
          </div>

          <div>
            <span className="gc-status-dot gc-status-dot-danger me-2"></span>
            Attention Required
          </div>

          <div>
            <span className="gc-status-dot gc-status-dot-accent me-2"></span>
            In Progress
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-5">
        <h2>Alerts</h2>

        <div className="d-flex flex-column gap-2">
          <div className="gc-alert gc-alert-success">
            Request successfully submitted.
          </div>

          <div className="gc-alert gc-alert-danger">
            There was a problem processing the request.
          </div>

          <div className="gc-alert gc-alert-info">
            Your appointment is scheduled for tomorrow.
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mb-5">
        <h2>Form</h2>

        <div className="gc-card">
          <div className="mb-3">
            <label className="gc-form-label">
              Student Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter student name"
            />
          </div>

          <div className="mb-3">
            <label className="gc-form-label">
              Service
            </label>

            <select className="form-select">
              <option>Select a service</option>
              <option>Counseling</option>
              <option>Good Moral</option>
              <option>Career Service</option>
            </select>
          </div>

          <div>
            <label className="gc-form-label">
              Example Error
            </label>

            <input
              type="text"
              className="form-control gc-input-error"
              placeholder="Invalid input"
            />

            <div className="gc-form-error">
              This field contains an error.
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="mb-5">
        <h2>Table</h2>

        <div className="gc-card">
          <div className="table-responsive">
            <table className="gc-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Student</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>REQ-001</td>
                  <td>Juan Dela Cruz</td>
                  <td>Counseling</td>
                  <td>
                    <span className="gc-badge gc-badge-pending">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>REQ-002</td>
                  <td>Maria Santos</td>
                  <td>Good Moral</td>
                  <td>
                    <span className="gc-badge gc-badge-approved">
                      Approved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StyleGuide;