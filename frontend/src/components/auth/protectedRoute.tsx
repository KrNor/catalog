import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (user && user.user.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
export default ProtectedRoute;
