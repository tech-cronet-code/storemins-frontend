// // QuickLinksSidebar.tsx

// import React from "react";
// import { NavLink } from "react-router-dom";

// const links = [
//   { label: "Home", to: "/customer" },
//   { label: "My Account", to: "/customer/account" },
//   { label: "My Orders", to: "/customer/orders" },
//   { label: "Contact Us", to: "/customer/contact" },
// ];

// const QuickLinksSidebar: React.FC = () => {
//   return (
//     <div className="w-full max-w-xs">
//       <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//       <ul className="space-y-2 text-sm">
//         {links.map((link) => (
//           <li key={link.to}>
//             <NavLink
//               to={link.to}
//               end
//               className={({ isActive }) =>
//                 `block px-2 py-1 rounded transition ${
//                   isActive
//                     ? "font-medium text-black"
//                     : "text-gray-700 hover:underline"
//                 }`
//               }
//             >
//               {link.label}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default QuickLinksSidebar;
