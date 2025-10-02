import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, X } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationType } from "../utils/types";

export default function NotificationsPage() {
  const { notifications, markAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  // 🔹 Gérer les toasts auto-dismiss
  useEffect(() => {
    if (!notifications || notifications.length === 0) return; // ✅ condition INSIDE useEffect

    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notif) => {
      if (notif.autoDismiss) {
        const timer = setTimeout(() => {
          markAsRead(notif._id);
        }, notif.autoDismiss);
        timers.push(timer);
      }
    });

    return () => timers.forEach((t) => clearTimeout(t)); // cleanup
  }, [notifications, markAsRead]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-20 text-center text-gray-500">
        Chargement des notifications...
      </div>
    );
  }

  const sortedNotifs = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleClick = (notif: NotificationType) => {
    if (!notif.isRead) markAsRead(notif._id);

    switch (notif.type) {
      case "new_product":
        navigate("/market");
        break;
      default:
        if (notif.link) navigate(notif.link);
        break;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🔔 Mes Notifications</h1>

      {sortedNotifs.length === 0 ? (
        <p className="text-center text-gray-500">Aucune notification pour le moment 👌</p>
      ) : (
        <ul className="space-y-4">
          {sortedNotifs.map((notif) => (
            <li
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`flex items-center justify-between p-4 rounded-xl shadow-sm border cursor-pointer transition
                ${notif.isRead ? "bg-white border-gray-200 hover:shadow-md" : "bg-indigo-50 border-indigo-200 hover:shadow-lg"}`}
            >
              <div>
                <p className="text-gray-800">{notif.message}</p>
                <small className="flex items-center text-gray-500 text-sm mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>

              {notif.isRead ? (
                <CheckCircle2 className="text-green-500 w-6 h-6" />
              ) : (
                <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Nouveau
                </span>
              )}

              {notif.autoDismiss && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="ml-3 text-white hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
