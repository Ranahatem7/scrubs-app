import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.muted,
          fontSize: 13,
          letterSpacing: "0.1em",
        }}
      >
        Loading…
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
