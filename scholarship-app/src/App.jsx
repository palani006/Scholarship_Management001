import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import ScholarshipList from './components/ScholarshipList';
import CreateScholarshipPage from './components/CreateScholarshipPage';
import EditScholarshipPage from './components/EditScholarshipPage';
import ApplicationList from './components/ApplicationList';
import MyApplications from './components/MyApplications';
import CreateApplicationPage from './components/CreateApplicationPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes - User/Admin */}
        <Route
          path="/scholarships"
          element={
            <ProtectedRoute>
              <ScholarshipList />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/scholarships/new"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateScholarshipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scholarships/:id/edit"
          element={
            <ProtectedRoute requiredRole="admin">
              <EditScholarshipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute requiredRole="admin">
              <ApplicationList />
            </ProtectedRoute>
          }
        />

        {/* User Only Routes */}
        <Route
          path="/applications/me"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/new"
          element={
            <ProtectedRoute>
              <CreateApplicationPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
