import React from "react";
import { useAuth } from "../../auth/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  console.log(user, "useruseruseruser");

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default React.memo(Header);
