import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

function EditScholarshipPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    eligibility: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await client.get('/scholarships/');
        const scholarship = response.data.find((s) => s.id === parseInt(id));
        if (scholarship) {
          setForm({
            name: scholarship.name,
            description: scholarship.description,
            amount: scholarship.amount.toString(),
            deadline: scholarship.deadline,
            eligibility: scholarship.eligibility,
          });
        } else {
          setError('Scholarship not found');
        }
      } catch (err) {
        setError('Failed to load scholarship data');
      } finally {
        setFetching(false);
      }
    };
    fetchScholarship();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await client.put(`/scholarships/${id}`, {
        ...form,
        amount: parseFloat(form.amount),
      });
      navigate('/scholarships');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update scholarship');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container form-wide animate-fade-in-up">
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">✏️</div>
            <h1 className="form-title">Edit Scholarship</h1>
            <p className="form-subtitle">Update the scholarship details</p>
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="es-name">Scholarship Name</label>
              <input
                id="es-name"
                className="form-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="es-description">Description</label>
              <textarea
                id="es-description"
                className="form-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="es-amount">Amount (₹)</label>
                <input
                  id="es-amount"
                  className="form-input"
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="any"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="es-deadline">Deadline</label>
                <input
                  id="es-deadline"
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
              <label className="form-label" htmlFor="es-eligibility">Eligibility Criteria</label>
              <textarea
                id="es-eligibility"
                className="form-textarea"
                name="eligibility"
                value={form.eligibility}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Updating...' : 'Update Scholarship'}
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

export default EditScholarshipPage;
