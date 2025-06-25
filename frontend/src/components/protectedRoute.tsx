import React, { type ReactNode } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthHook } from "../hooks";

interface PrivateRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  navigate("/login", { replace: true });
  const { user } = AuthHook();
  if (user && user.user.role === "admin") {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};
export default ProtectedRoute;
