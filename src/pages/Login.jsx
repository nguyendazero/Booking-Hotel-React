import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import loginImage from "../assets/image/login.jpg";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-fuchsia-300 to-fuchsia-300">
      <div className="flex w-4/5 max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Hình ảnh bên trái */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Form đăng nhập */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Log in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium text-gray-600"
              >
                Username or Email
              </label>
              <input
                type="text"
                name="usernameOrEmail"
                id="usernameOrEmail"
                placeholder="Enter your username or email"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Hoặc đăng nhập bằng */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1 border-t border-gray-300 mr-2"></div>
            <span className="text-gray-600">Or log in with</span>
            <div className="flex-1 border-t border-gray-300 ml-2"></div>
          </div>

          {/* Các nút mạng xã hội */}
          <div className="flex justify-around mt-6">
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <GoogleOutlined className="mr-2 text-3xl" style={{backgroundColor: "white", color: "red"}} /> Google
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <FacebookOutlined className="mr-2 text-3xl" style={{backgroundColor: "blue", color: "white"}} />
              Facebook
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <GithubOutlined className="mr-2 text-3xl" /> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
