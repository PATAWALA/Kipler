import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminBottomNav from "../components/ui/AdminBottomNav";
import UserBottomNav from "../components/ui/UserBottomNav";
import UserSidebar from "../components/ui/userSidebar";
import AdminSidebar from "../components/ui/AdminSidebar";
import UserNavbar from "../components/ui/UserNavbar";
import AdminNavbar from "../components/ui/AdminNavbar";
import { UserType } from "../utils/types";
import { getCurrentUser } from "../utils/auth";
import { getProductsByUser, ProductType } from "../services/productServices";

interface MainLayoutProps {
  role: "admin" | "user";
  onLogout: () => void;
}

export default function MainLayout({ role, onLogout }: MainLayoutProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const currentUser = getCurrentUser() as UserType | null;

  useEffect(() => {
    if (!currentUser) return;
    const fetchProducts = async () => {
      try {
        const data = await getProductsByUser(currentUser._id);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      {role === "admin" ? (
        <AdminSidebar onLogout={onLogout} />
      ) : (
        <UserSidebar onLogout={onLogout} />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar Desktop */}
        <div className="fixed top-0 left-0 right-0 z-40">
          {/* Wrapper pour aligner navbar avec sidebar */}
          <div className="flex w-full">
            <div className="hidden md:block w-64" /> {/* espace sidebar */}
            <div className="flex-1">
              {role === "admin" ? (
                <AdminNavbar onLogout={onLogout} />
              ) : (
                <UserNavbar onLogout={onLogout} />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0 mt-[66px] md:ml-64">
          <Outlet context={{ products, currentUser }} />
        </main>

        {/* Bottom Navigation mobile */}
        {role === "user" && (
          <div className="md:hidden fixed bottom-0 left-0 w-full z-30">
            <UserBottomNav />
          </div>
        )}
        {role === "admin" && (
          <div className="md:hidden fixed bottom-0 left-0 w-full z-30">
            <AdminBottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
