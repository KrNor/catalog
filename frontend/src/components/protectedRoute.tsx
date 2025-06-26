import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthHook } from "../hooks";

const ProtectedRoute: FC = () => {
  const { user } = AuthHook();
  if (user && user.user.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
export default ProtectedRoute;
