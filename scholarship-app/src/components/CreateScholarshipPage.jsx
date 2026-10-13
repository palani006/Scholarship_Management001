import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function CreateScholarshipPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    eligibility: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await client.post('/scholarships/', {
        ...form,
        amount: parseFloat(form.amount),
      });
      navigate('/scholarships');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create scholarship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container form-wide animate-fade-in-up">
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">🏆</div>
            <h1 className="form-title">Create Scholarship</h1>
            <p className="form-subtitle">Add a new scholarship opportunity for students</p>
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="cs-name">Scholarship Name</label>
              <input
                id="cs-name"
                className="form-input"
                type="text"
                name="name"
                placeholder="e.g., Merit Excellence Award"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cs-description">Description</label>
              <textarea
                id="cs-description"
                className="form-textarea"
                name="description"
                placeholder="Describe the scholarship, its purpose, and benefits..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cs-amount">Amount (₹)</label>
                <input
                  id="cs-amount"
                  className="form-input"
                  type="number"
                  name="amount"
                  placeholder="50000"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="any"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cs-deadline">Deadline</label>
                <input
                  id="cs-deadline"
                  className="form-input"
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cs-eligibility">Eligibility Criteria</label>
              <textarea
                id="cs-eligibility"
                className="form-textarea"
                name="eligibility"
                placeholder="Describe who is eligible to apply..."
                value={form.eligibility}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Creating...' : 'Create Scholarship'}
              </button>
              <button
                className="btn btn-ghost btn-lg"
                type="button"
                onClick={() => navigate('/scholarships')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateScholarshipPage;
