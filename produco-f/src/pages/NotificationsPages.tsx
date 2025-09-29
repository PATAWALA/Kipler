// pages/NotificationsPage.tsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2 } from "lucide-react";
import { NotificationContext } from "../context/notificationsContext";
import { NotificationType } from "../utils/types";

export default function NotificationsPage() {
  const notifContext = useContext(NotificationContext);
  if (!notifContext) throw new Error("NotificationContext must be used within a NotificationsProvider");

  const { notifications, markAsRead } = notifContext;
  const navigate = useNavigate();

  const handleClick = (notif: NotificationType) => {
  if (!notif.read) markAsRead(notif._id);

  // 🔹 Gestion des redirections dynamiques
  switch (notif.type) {
    case "new_product":
      navigate("/market");
      break;

    case "order_status":
      navigate(`/orders/${notif.link}`); // exemple : lien vers une commande précise
      break;

    case "message":
      navigate(`/messages/${notif.link}`);
      break;

    default:
      if (notif.link) {
        navigate(notif.link);
      }
      break;
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🔔 Mes Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">Aucune notification pour le moment 👌</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif: NotificationType) => (
            <li
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`flex items-center justify-between p-4 rounded-xl shadow-sm border cursor-pointer transition 
                ${notif.read ? "bg-white border-gray-200 hover:shadow-md" : "bg-indigo-50 border-indigo-200 hover:shadow-lg"}
              `}
            >
              <div>
                <p className="text-gray-800">{notif.message}</p>
                <small className="flex items-center text-gray-500 text-sm mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>
              {notif.read ? (
                <CheckCircle2 className="text-green-500 w-6 h-6" />
              ) : (
                <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Nouveau
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
