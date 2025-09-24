import { LayoutDashboard, Package, DollarSign, Phone, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserBottomNav() {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Accueil", path: "/user-dashboard", icon: LayoutDashboard },
    { label: "Produits", path: "/user-dashboard/products", icon: Package },
    { label: "Marché", path: "/user-dashboard/market", icon: ShoppingBag },
    { label: "Gains", path: "/user-dashboard/gains", icon: DollarSign },
    { label: "Contact", path: "/user-dashboard/contact", icon: Phone },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 flex justify-around items-center py-2 md:hidden z-50">
      {menuItems.map(item => {
        const Icon = item.icon;
        return (
          <button key={item.path} onClick={() => navigate(item.path)} className="flex flex-col items-center text-gray-500 hover:text-blue-500 text-[10px]">
            <Icon size={24} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
