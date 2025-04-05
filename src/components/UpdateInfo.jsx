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

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(null);
  
  // State to toggle between update info form and change password form
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { putData, loading, error } = usePut(
    "http://localhost:8080/api/v1/user/update-info"
  );
  const {
    postData,
    loading: refreshLoading,
    error: refreshError,
  } = usePost("http://localhost:8080/api/v1/public/refresh-token");

  // usePut for change password API
  const { putData: changePasswordData, loading: changePasswordLoading, error: changePasswordError } = usePut(
    "http://localhost:8080/api/v1/user/change-password"
  );

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhoneNumber(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isChangePassword) {
      // Call change password function
      await handleChangePassword();
      return;
    }

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

      if (response) {
        dispatch(updateUser(response));

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

  // Toggle to show the change password form
  const handleChangePasswordClick = () => {
    setIsChangePassword(true);
  };

  // Go back to the update info form
  const handleBackToUpdateInfo = () => {
    setIsChangePassword(false);
  };

  // Handle change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== rePassword) {
      alert("New password and confirmation password do not match.");
      return;
    }

    const passwordData = {
      oldPassword: currentPassword,
      newPassword: newPassword,
      rePassword: rePassword,
    };

    try {
      const response = await changePasswordData(passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        alert("Password updated successfully!");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Error updating password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 max-w-3xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
      >
        X
      </button>

      {/* Always display user avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-4">
        {avatar ? (
          <img
            src={URL.createObjectURL(avatar)}
            alt="Avatar Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          "+"
        )}
      </div>

      {/* Toggle between Update Info Form and Change Password Form */}
      {!isChangePassword ? (
        <>
          <form onSubmit={handleSubmit} className="w-full pointer-events-auto">
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
          
          {/* Change Password Button */}
          <button
            onClick={handleChangePasswordClick}
            className="mt-4 text-blue-500"
          >
            Change Password
          </button>
        </>
      ) : (
        <>
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="w-78">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-700 text-white p-2 rounded-md hover:bg-green-600"
              disabled={changePasswordLoading}
            >
              {changePasswordLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          {/* Button to go back to Update Info */}
          <button
            onClick={handleBackToUpdateInfo}
            className="mt-4 text-gray-500"
          >
            Back to Update Info
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {changePasswordError && <p className="text-red-500 mt-2">{changePasswordError}</p>}
    </div>
  );
};

export default UserProfileUpdate;
