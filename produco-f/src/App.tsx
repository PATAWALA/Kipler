import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Login,
  Register,
  UserDashboard,
  AboutPage,
  WalletPage,
  AllProducts,
  ContactUsersPage,
  AdminUsers,
  MyProducts,
  MesGains,
  PublishProduct,
} from "./pages/index";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./layouts/MainLayout";
import { getCurrentUser, logoutUser } from "./utils/auth";
import { UserType } from "./utils/types";
import AdminGestionP from "./pages/AdminGestionP";
import { NotificationProvider } from "./context/notificationsProvider";
import NotificationsPage from "./pages/NotificationsPages";
import ProtectedAdmin from "./components/ui/ProtectAdmin";

export default function App() {
  const [user, setUser] = useState<UserType | null>(getCurrentUser());

  useEffect(() => {
    const handleStorageChange = () => setUser(getCurrentUser());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <NotificationProvider userId={user?._id} role={user?.role || "user"}>
      <Routes>
        {/* Routes publiques */}
        {!user && (
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Market accessible à tous */}
        <Route path="/market" element={<AllProducts />} />

        {/* Routes admin */}
        {user?.role === "admin" && (
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedAdmin>
                <MainLayout role="admin" onLogout={handleLogout} />
              </ProtectedAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="contact" element={<ContactUsersPage />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="publish" element={<PublishProduct />} />
            <Route path="admingestion" element={<AdminGestionP />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        )}

        {/* Routes user */}
        {user?.role === "user" && (
          <Route
            path="/user-dashboard/*"
            element={<MainLayout role="user" onLogout={handleLogout} />}
          >
            <Route index element={<UserDashboard />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="market" element={<AllProducts />} />
            <Route path="gains" element={<MesGains />} />
            <Route path="contact" element={<ContactUsersPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        )}

        {/* Redirect unknown paths */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin-dashboard"
                    : "/user-dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </NotificationProvider>
  );
}
