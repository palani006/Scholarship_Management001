import { useState, useEffect } from 'react';
import client from '../api/client';

function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await client.get('/applications/');
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await client.put(`/applications/${id}`, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      showToast(`Application ${newStatus.toLowerCase()} successfully`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      default:
        return 'under-review';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Stats calculation
  const totalApps = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const pendingCount = applications.filter((a) => a.status === 'Under Review').length;

  return (
    <div className="page-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">Review and manage student scholarship applications</p>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon primary">📬</div>
          <div>
            <div className="stat-value">{totalApps}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">✅</div>
          <div>
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger">❌</div>
          <div>
            <div className="stat-value">{rejectedCount}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No Applications Yet</h3>
          <p className="empty-state-text">
            No students have submitted applications yet. They'll appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="table-container animate-fade-in">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Scholarship</th>
                <th>Statement</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td><strong>#{app.id}</strong></td>
                  <td><strong>{app.username || `User #${app.user_id}`}</strong></td>
                  <td>{app.scholarship_name || `Scholarship #${app.scholarship_id}`}</td>
                  <td style={{ maxWidth: '250px' }}>
                    {app.statement.length > 80
                      ? app.statement.substring(0, 80) + '...'
                      : app.statement}
                  </td>
                  <td>{formatDate(app.applied_at)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {app.status !== 'Approved' && (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => handleStatusUpdate(app.id, 'Approved')}
                        >
                          Approve
                        </button>
                      )}
                      {app.status !== 'Rejected' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicationList;
