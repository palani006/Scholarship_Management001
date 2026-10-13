import { useState, useEffect } from 'react';
import client from '../api/client';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const response = await client.get('/applications/me');
        setApplications(response.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track the status of your submitted scholarship applications</p>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon primary">📄</div>
          <div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Submitted</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">✅</div>
          <div>
            <div className="stat-value">
              {applications.filter((a) => a.status === 'Approved').length}
            </div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div>
            <div className="stat-value">
              {applications.filter((a) => a.status === 'Under Review').length}
            </div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No Applications Submitted</h3>
          <p className="empty-state-text">
            You haven't applied to any scholarships yet. Browse available scholarships and submit your applications.
          </p>
        </div>
      ) : (
        <div className="scholarship-grid">
          {applications.map((app) => (
            <div key={app.id} className="card animate-fade-in-up">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    {app.scholarship_name || `Scholarship #${app.scholarship_id}`}
                  </h3>
                </div>
                <span className={`status-badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <p className="card-description">
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Statement
                </strong>
                <br />
                {app.statement}
              </p>

              <div className="card-meta">
                <div className="card-meta-item">
                  <span className="icon">📅</span>
                  <span>Applied: {formatDate(app.applied_at)}</span>
                </div>
                <div className="card-meta-item">
                  <span className="icon">🆔</span>
                  <span>Application #{app.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
