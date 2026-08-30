import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardPlaceholder from './pages/Dashboard/DashboardPlaceholder';
import CitizenDashboard from './pages/Citizen/CitizenDashboard';
import SubmitChallenge from './pages/Citizen/SubmitChallenge';
import ChallengeExplorer from './pages/Challenges/ChallengeExplorer';
import ChallengeDetails from './pages/Challenges/ChallengeDetails';
import UniversityDashboard from './pages/University/UniversityDashboard';
import ProjectWorkspace from './pages/University/ProjectWorkspace';
import IndustryDashboard from './pages/Industry/IndustryDashboard';
import GovernmentDashboard from './pages/Government/GovernmentDashboard';
import AdminOverview from './pages/Admin/AdminOverview';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminUniversities from './pages/Admin/AdminUniversities';
import AdminIndustries from './pages/Admin/AdminIndustries';
import AdminChallenges from './pages/Admin/AdminChallenges';
import AdminCategories from './pages/Admin/AdminCategories';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardRedirect from './routes/DashboardRedirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/placeholder"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/submit-challenge"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <SubmitChallenge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <ChallengeExplorer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges/:id"
        element={
          <ProtectedRoute>
            <ChallengeDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/university/dashboard"
        element={
          <ProtectedRoute allowedRoles={['university']}>
            <UniversityDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/industry/dashboard"
        element={
          <ProtectedRoute allowedRoles={['industry']}>
            <IndustryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/government/dashboard"
        element={
          <ProtectedRoute allowedRoles={['government']}>
            <GovernmentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/universities"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUniversities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/industries"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminIndustries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/challenges"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminChallenges />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCategories />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

    </Routes >
  );
}

export default App;