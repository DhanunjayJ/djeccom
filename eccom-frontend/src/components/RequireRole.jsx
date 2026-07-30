import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../auth";

export default function RequireRole({ roles, children }) {
  const user = getStoredUser();
  const location = useLocation();

  if (!user?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
