import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';

function CreateApplicationPage() {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState('');
  const [statement, setStatement] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await client.get('/scholarships/');
        setScholarships(response.data);

        // Pre-select scholarship if passed via URL
        const preselectedId = searchParams.get('scholarship_id');
        if (preselectedId) {
          setSelectedScholarship(preselectedId);
        }
      } catch (err) {
        console.error('Failed to fetch scholarships', err);
      } finally {
        setFetching(false);
      }
    };
    fetchScholarships();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedScholarship) {
      setError('Please select a scholarship');
      return;
    }

    setLoading(true);

    try {
      await client.post('/applications/', {
        scholarship_id: parseInt(selectedScholarship),
        statement,
      });
      navigate('/applications/me');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const selectedDetails = scholarships.find(
    (s) => s.id === parseInt(selectedScholarship)
  );

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
            <div className="form-header-icon">📝</div>
            <h1 className="form-title">Apply for Scholarship</h1>
            <p className="form-subtitle">Submit your application with a personal statement</p>
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="ca-scholarship">Select Scholarship</label>
              <select
                id="ca-scholarship"
                className="form-select"
                value={selectedScholarship}
                onChange={(e) => setSelectedScholarship(e.target.value)}
                required
              >
                <option value="">Choose a scholarship...</option>
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ₹{s.amount.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {selectedDetails && (
              <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 className="card-title" style={{ fontSize: '1rem' }}>{selectedDetails.name}</h4>
                  <span className="scholarship-amount" style={{ fontSize: '1.25rem' }}>
                    ₹{selectedDetails.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="card-description" style={{ marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                  {selectedDetails.description}
                </p>
                <div className="card-meta">
                  <div className="card-meta-item">
                    <span className="icon">📅</span>
                    <span>Deadline: {selectedDetails.deadline}</span>
                  </div>
                  <div className="card-meta-item">
                    <span className="icon">✅</span>
                    <span>{selectedDetails.eligibility}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="ca-statement">Personal Statement</label>
              <textarea
                id="ca-statement"
                className="form-textarea"
                placeholder="Tell us why you deserve this scholarship, your achievements, and future goals..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                required
                style={{ minHeight: '160px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-accent btn-lg" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Submitting...' : 'Submit Application'}
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

export default CreateApplicationPage;
