// src/modules/dashboard/components/Sidebar.tsx
import { Link } from 'react-router-dom';
import { UserRoleName } from '../../auth/constants/userRoles';

const Sidebar = ({ role }: { role: UserRoleName }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul>
        {role === UserRoleName.SELLER && (
          <>
            <li className="mb-2">
              <Link to="/seller/products" className="hover:text-gray-400">
                Products
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/seller/orders" className="hover:text-gray-400">
                Orders
              </Link>
            </li>
          </>
        )}
        {role === UserRoleName.ADMIN && (
          <>
            <li className="mb-2">
              <Link to="/admin/stores" className="hover:text-gray-400">
                Stores
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/users" className="hover:text-gray-400">
                Users
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;