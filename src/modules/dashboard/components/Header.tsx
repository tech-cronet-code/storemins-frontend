// src/modules/dashboard/components/Header.tsx
import { useAuth } from '../../user/auth/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Welcome, {user?.email}</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;