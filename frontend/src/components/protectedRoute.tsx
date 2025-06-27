import { Navigate, Outlet } from "react-router-dom";

import { AuthHook } from "../hooks";

const ProtectedRoute = () => {
  const { user } = AuthHook();
  if (user && user.user.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
export default ProtectedRoute;
