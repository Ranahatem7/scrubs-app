import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminRoute({ children, redirectTo = "/admin/login" }) {
  const { isAdmin } = useAdmin();
  return isAdmin ? children : <Navigate to={redirectTo} replace />;
}