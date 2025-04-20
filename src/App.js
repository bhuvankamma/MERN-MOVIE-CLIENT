// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth_temp/AuthContext";
import { AuthProvider } from "./auth_temp/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AllMovies from "./pages/AllMovies";
import TrailersPage from "./pages/TrailersPage";
import NotFound from "./pages/NotFound";
import AccountSuspended from './pages/AccountSuspended'; // Import the 

// ✅ Correct imports
import AdminMessages from './components/admin/AdminMessages';
import UserMessages from './components/UserMessages';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === "user") return <Navigate to="/user-dashboard" replace />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === "user") return <Navigate to="/user-dashboard" replace />;
  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/user-dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
          <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          
          <Route path="/all-movies" element={<RequireAuth><AllMovies /></RequireAuth>} />
          <Route path="/trailers" element={<RequireAuth><TrailersPage /></RequireAuth>} />
          <Route path="/account-suspended" element={<AccountSuspended />} />

          {/* ✅ Admin and User Messages Routes */}
          <Route path="/admin/messages" element={<RequireAuth><AdminMessages /></RequireAuth>} />
          <Route path="/user/messages" element={<RequireAuth><UserMessages /></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
