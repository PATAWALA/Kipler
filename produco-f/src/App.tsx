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
import { NotificationsProvider } from "./context/notificationsProvider";
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
    <NotificationsProvider userId={user?._id || ""}>
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Market accessible à tous */}
        <Route path="/market" element={<AllProducts />} />

        {/* Admin Routes */}
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

        {/* User Routes */}
        <Route
          path="/user-dashboard/*"
          element={
            user?.role === "user" ? (
              <MainLayout role="user" onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="products" element={<MyProducts />}/>
          <Route path="market" element={<AllProducts />}/>
          <Route path="gains" element={<MesGains />} />
          <Route path="contact" element={<ContactUsersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Redirect all unknown paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </NotificationsProvider>
  );
}
