import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoImage from "../assets/image/logo.png";
import { NavLink } from "react-router-dom";
import { logout } from "../store/authSlice"; // Giả sử bạn có action logout
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function MainNavigation() {
  // Lấy user từ Redux state
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Trạng thái để quản lý dropdown menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Hàm để xử lý logout
  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout từ redux (hoặc sử dụng logic riêng của bạn)
    setDropdownOpen(false); // Đóng dropdown sau khi logout
  };

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
          className={({ isActive }) =>
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
          className={({ isActive }) =>
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
          className={({ isActive }) =>
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
      <div className="relative flex items-center space-x-4">
        <button className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100">
          List your property
        </button>

        {/* Hiển thị avatar hoặc icon login */}
        {user ? (
          user.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <UserOutlined style={{ fontSize: "2.0rem" }} />
          )
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center text-gray-700 hover:text-gray-900"
          >
            <UserOutlined style={{ fontSize: "1.5rem" }} />
            <span className="text-sm mt-1">Login</span>
          </Link>
        )}

        {/* Biểu tượng menu ☰ */}
        {user && (
          <div
            className="cursor-pointer text-2xl"
            onClick={() => setDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          >
            ☰
          </div>
        )}

        {/* Dropdown Menu */}
        {user && isDropdownOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
            >
              Logout
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition">
              Update information
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition">
              History booking
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;