import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path ? 'header-nav-link active' : 'header-nav-link';

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/scholarships" className="header-logo">
          <div className="header-logo-icon">🎓</div>
          ScholarHub
        </Link>

        <nav className="header-nav">
          <Link to="/scholarships" className={isActive('/scholarships')}>
            Scholarships
          </Link>
          {user.role === 'admin' && (
            <>
              <Link to="/scholarships/new" className={isActive('/scholarships/new')}>
                Add Scholarship
              </Link>
              <Link to="/applications" className={isActive('/applications')}>
                All Applications
              </Link>
            </>
          )}
          {user.role === 'user' && (
            <>
              <Link to="/applications/new" className={isActive('/applications/new')}>
                Apply
              </Link>
              <Link to="/applications/me" className={isActive('/applications/me')}>
                My Applications
              </Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          <div className="header-user-badge">
            <div className="header-user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
            <span className={`header-role-tag ${user.role}`}>{user.role}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
