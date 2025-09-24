import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/ui/AdminNavbar";
import AdminBottomNav from "../components/ui/AdminBottomNav";
import UserNavbar from "../components/ui/UserNavbar";
import UserBottomNav from "../components/ui/UserBottomNav";
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
    <div className="flex min-h-screen bg-gray-100 flex-col">
      {/* Navbar */}
      {role === "admin" ? (
        <AdminNavbar onLogout={onLogout} />
      ) : (
        <UserNavbar onLogout={onLogout} />
      )}

      {/* Contenu principal */}
      <main className="flex-1 p-6 pt-[66px] overflow-y-auto">
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
  );
}
