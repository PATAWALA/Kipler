import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";

export default function ProtectedAdmin({ children }: { children: JSX.Element }) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

