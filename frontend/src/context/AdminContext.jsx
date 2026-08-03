import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem("admin_token") || null
  );

  const login = (token) => {
    localStorage.setItem("admin_token", token);
    setAdminToken(token);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdminToken(null);
  };

  return (
    <AdminContext.Provider value={{ adminToken, isAdmin: !!adminToken, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}