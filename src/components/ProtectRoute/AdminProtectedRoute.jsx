import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu đã đăng nhập và có quyền admin, cho phép truy cập các route con
  return <Outlet />;
}

export default AdminProtectedRoute;