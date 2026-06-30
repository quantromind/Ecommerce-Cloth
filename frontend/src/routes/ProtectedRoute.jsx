import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * WHY: This protects pages from unauthorized access (not logged in / wrong role).
 * Usage:
 *   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>...</Route>
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-text-main">
        <div className="text-sm opacity-80">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Verified gate for Brand/Dealer
  if ((user?.role === "brand" || user?.role === "dealer") && !user?.isVerified) {
    return <Navigate to="/pending-approval" replace />;
  }

  // Role check
  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
