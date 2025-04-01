import { Bell } from "lucide-react";
import userImage from "../assets/image/avatar-header.png";
import logoImage from "../assets/image/logo.png";
import { NavLink } from "react-router-dom";

function MainNavigation() {
  return (
    <header className="max-w-7xl mx-auto p-4 flex items-center justify-between border-b-2 border-gray-300">
      {/* Logo */}
      <div className="flex items-center space-x-2 border-r-2 pr-4">
        <img src={logoImage} alt="Logo" className="w-30 rounded-full" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center border rounded-full px-4 py-2 shadow-sm border-gray-300">
        <NavLink
          to="/"
          className={
            ({ isActive }) =>
              `px-4 py-2 rounded-full ${
                isActive
                  ? "font-bold text-cyan-50 bg-purple-700"
                  : "text-gray-700"
              }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/checkin"
          className={
            ({ isActive }) =>
              `px-4 py-2 border-l rounded-full ${
                isActive
                  ? "font-bold text-cyan-50 bg-purple-700"
                  : "text-gray-700"
              }`
          }
        >
          Checkin
        </NavLink>
        <NavLink
          to="/hotels"
          className={
            ({ isActive }) =>
              `px-4 py-2 border-l rounded-full ${
                isActive
                  ? "font-bold text-cyan-50 bg-purple-700"
                  : "text-gray-700"
              }`
          }
        >
          Hotels
        </NavLink>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100">
          List your property
        </button>
        <div className="relative">
          <Bell className="w-5 h-5 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
        </div>
        <img src={userImage} alt="User" className="w-10 h-10 rounded-full" />
        <div className="cursor-pointer text-2xl">☰</div>
      </div>
    </header>
  );
}

export default MainNavigation;
