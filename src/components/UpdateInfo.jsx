import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import usePut from "../hooks/usePut"; 
import usePost from "../hooks/usePost";
import { updateUser, login } from "../store/authSlice"; 
import Cookies from "js-cookie";

const UserProfileUpdate = ({ onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const refreshToken = user?.refreshToken;

  const dispatch = useDispatch();

  const [fullName, setFullName] = useState(user.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(null);

  const { putData, loading, error } = usePut(
    "http://localhost:8080/api/v1/user/update-info"
  );
  const {
    postData,
    loading: refreshLoading,
    error: refreshError,
  } = usePost("http://localhost:8080/api/v1/public/refresh-token");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhoneNumber(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phoneNumber);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await putData(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra trực tiếp response
      if (response) {
        dispatch(updateUser(response)); // Cập nhật thông tin user trong Redux

        const newTokenResponse = await postData({
          refreshToken: refreshToken,
        });

        if (newTokenResponse) {
          const newToken = newTokenResponse;

          if (newToken) {
            Cookies.set("token", newToken, { expires: 7 });
            dispatch(login({ token: newToken }));
          }
        }
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 max-w-3xl">
      {/* Nút đóng Modal */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
      >
        X
      </button>
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-4">
        {avatar ? (
          <img
            src={URL.createObjectURL(avatar)} // Hiển thị avatar mới được chọn
            alt="Avatar Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          "+"
        )}
      </div>
      <form onSubmit={handleSubmit} className="w-full pointer-events-auto">
        {/* Đặt pointer-events-none khi loading */}
        <fieldset disabled={loading} className={loading ? "opacity-50" : ""}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="123 5678 9101"
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Avatar Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-violet-700 text-white p-2 rounded-md hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </fieldset>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default UserProfileUpdate;
