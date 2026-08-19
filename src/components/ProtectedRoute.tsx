import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../store/authStore";
import type { JSX } from "react/jsx-runtime";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
