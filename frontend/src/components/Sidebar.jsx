import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on the online status
  const filteredUsers = showOnlineOnly
    ? users.filter(user => onlineUsers.includes(user.id))
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button
          onClick={() => setShowOnlineOnly(prev => !prev)}
          className="toggle-online-button"
        >
          {showOnlineOnly ? "Show All Users" : "Show Online Users Only"}
        </button>
      </div>
      <div className="user-list">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            <Users size={24} />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
