import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logoImage from "../assets/image/logo.png";
import { NavLink } from "react-router-dom";
import { logout } from "../store/authSlice";
import { UserOutlined } from "@ant-design/icons";
import { User, History, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import UserProfileUpdate from "./UpdateInfo";
import usePost from "../hooks/usePost";
import { Avatar } from "antd";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MainNavigation() {
  // Lấy user và token từ Redux state
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Trạng thái để quản lý dropdown menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  //Trạng thái của modal update info
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Sử dụng hook usePost để gọi API đăng ký owner
  const {
    postData: registerOwner,
    loading: registeringOwner,
    error: registerOwnerError,
  } = usePost(`${API_BASE_URL}/api/v1/user/owner-registration`);

  // Hàm để xử lý logout
  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout từ redux
    setDropdownOpen(false); // Đóng dropdown sau khi logout
  };

  // Hàm để đóng dropdown
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Hàm xử lý đăng ký làm owner
  const handleRegisterOwner = async () => {
    if (!token) {
      alert("Please log in to register as a hotel owner.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await registerOwner(null, config); // Không có data cần gửi

    if (response) {
      alert("Your registration request has been sent to the system.");
    } else if (registerOwnerError) {
      alert(`Registration failed: ${registerOwnerError}`);
    }
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
          to="/user/checkin"
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
        {token !== null && user?.roles?.includes("ROLE_OWNER") && (
          <NavLink
            to="/owner/manage-hotel-owner"
            className={({ isActive }) =>
              `px-4 py-2 border-l rounded-full ${
                isActive
                  ? "font-bold text-cyan-50 bg-purple-700"
                  : "text-gray-700"
              }`
            }
          >
            Manage
          </NavLink>
        )}
        {token !== null && user?.roles?.includes("ROLE_OWNER") && (
          <NavLink
            to="/owner/statistics"
            className={({ isActive }) =>
              `px-4 py-2 border-l rounded-full ${
                isActive
                  ? "font-bold text-cyan-50 bg-purple-700"
                  : "text-gray-700"
              }`
            }
          >
            Statistics
          </NavLink>
        )}
      </div>

      {/* Actions */}
      <div className="relative flex items-center space-x-4">
        {token !== null && !user?.roles?.includes("ROLE_OWNER") && (
          <button
            className="bg-gradient-to-r cursor-pointer from-green-400 to-blue-500 text-white font-semibold rounded-full px-6 py-3 shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            onClick={handleRegisterOwner}
            disabled={registeringOwner}
          >
            {registeringOwner ? "Registering..." : "Register a hotel owner"}
          </button>
        )}

        {/* Hiển thị avatar hoặc icon login */}
        {user ? (
          user.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: "#87d068", marginRight: "5px" }}
              icon={<UserOutlined />}
            />
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

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
              <UserProfileUpdate onClose={() => setIsUpdateModalOpen(false)} />
            </div>
          </div>
        )}

        {/* Dropdown Menu */}
        {user && isDropdownOpen && (
          <div className="absolute top-12 right-0 w-50 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                setIsUpdateModalOpen(true);
                closeDropdown();
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition cursor-pointer flex items-center"
            >
              <User className="mr-2 text-blue-500" size={16} />{" "}
              {/* Màu xanh dương */}
              Update information
            </button>
            <Link
              to="/user/booking-history"
              onClick={closeDropdown}
              className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <History className="mr-2 text-yellow-500" size={16} />{" "}
              {/* Màu vàng */}
              History booking
            </Link>
            <Link
              to="/user/wish-list"
              onClick={closeDropdown}
              className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <Heart className="mr-2 text-red-500" size={16} /> {/* Màu đỏ */}
              Wish list
            </Link>
            <hr className="border-gray-200 my-1" /> {/* Thêm vạch ngăn cách */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition cursor-pointer flex items-center"
            >
              <LogOut className="mr-2 text-gray-500" size={16} />{" "}
              {/* Màu xám */}
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;
