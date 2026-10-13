import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

function ScholarshipList() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await client.get('/scholarships/');
      setScholarships(response.data);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/scholarships/${id}`);
      setScholarships(scholarships.filter((s) => s.id !== id));
      setDeleteModal(null);
      showToast('Scholarship deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete scholarship', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Scholarship</h3>
            <p className="modal-text">
              Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? This action cannot be undone and all associated applications will be affected.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteModal.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header-actions">
        <div className="page-header">
          <h1 className="page-title">Scholarships</h1>
          <p className="page-subtitle">
            {user?.role === 'admin'
              ? 'Manage and organize available scholarships'
              : 'Browse available scholarships and apply'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/scholarships/new" className="btn btn-primary">
            + Add Scholarship
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon primary">📋</div>
          <div>
            <div className="stat-value">{scholarships.length}</div>
            <div className="stat-label">Total Scholarships</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">💰</div>
          <div>
            <div className="stat-value">
              {formatAmount(scholarships.reduce((sum, s) => sum + s.amount, 0))}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div>
            <div className="stat-value">
              {scholarships.filter((s) => new Date(s.deadline) > new Date()).length}
            </div>
            <div className="stat-label">Active Deadlines</div>
          </div>
        </div>
      </div>

      {scholarships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <h3 className="empty-state-title">No Scholarships Yet</h3>
          <p className="empty-state-text">
            {user?.role === 'admin'
              ? 'Get started by creating your first scholarship.'
              : 'Check back soon for available scholarships.'}
          </p>
          {user?.role === 'admin' && (
            <Link to="/scholarships/new" className="btn btn-primary">
              + Create Scholarship
            </Link>
          )}
        </div>
      ) : (
        <div className="scholarship-grid">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="card scholarship-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{scholarship.name}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="scholarship-amount">{formatAmount(scholarship.amount)}</div>
                  <div className="scholarship-amount-label">Scholarship Value</div>
                </div>
              </div>

              <p className="card-description">
                {scholarship.description.length > 150
                  ? scholarship.description.substring(0, 150) + '...'
                  : scholarship.description}
              </p>

              <div className="card-meta">
                <div className="card-meta-item">
                  <span className="icon">📅</span>
                  <span>Deadline: {scholarship.deadline}</span>
                </div>
                <div className="card-meta-item">
                  <span className="icon">✅</span>
                  <span>{scholarship.eligibility.length > 40
                    ? scholarship.eligibility.substring(0, 40) + '...'
                    : scholarship.eligibility}</span>
                </div>
              </div>

              <div className="card-actions">
                {user?.role === 'user' && (
                  <button
                    className="btn btn-accent btn-sm"
                    onClick={() => navigate(`/applications/new?scholarship_id=${scholarship.id}`)}
                  >
                    Apply Now
                  </button>
                )}
                {user?.role === 'admin' && (
                  <>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/scholarships/${scholarship.id}/edit`)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setDeleteModal(scholarship)}
                    >
                      🗑 Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScholarshipList;
