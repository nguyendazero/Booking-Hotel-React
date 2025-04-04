import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate, NavLink } from "react-router-dom";
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
    fullName: "",
    username: "",
    email: "",
    rePassword: "",
    verificationCode: "", // Thêm field cho mã xác thực
  });
  const [isRegister, setIsRegister] = useState(false); // Quản lý trạng thái login hay register
  const [isVerify, setIsVerify] = useState(false); // Quản lý trạng thái xác thực
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      // Xử lý đăng ký (sẽ thực hiện gọi API đăng ký)
      console.log("Register data", formData);
      // Sau khi đăng ký xong, chuyển sang màn xác thực
      setIsRegister(false); // Đổi trạng thái về login để hiển thị form đăng nhập
      setIsVerify(true); // Chuyển sang trạng thái xác thực
    } else if (isVerify) {
      // Xử lý mã xác thực ở đây
      console.log("Verification code", formData.verificationCode);
      // Sau khi xác thực, điều hướng đến trang chính
      navigate("/"); // Hoặc bất kỳ trang nào bạn muốn
    } else {
      // Xử lý đăng nhập
      dispatch(loginUser(formData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      });
    }
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

        {/* Form đăng nhập hoặc đăng ký */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isVerify ? "Verify Your Account" : isRegister ? "Create an Account" : "Welcome Back!"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isVerify
              ? "Enter the verification code sent to your email"
              : isRegister
              ? "Create a new account"
              : "Log in to your account"}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Form fields cho register hoặc verify */}
            {isVerify ? (
              <div className="mb-6">
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-600"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  name="verificationCode"
                  id="verificationCode"
                  placeholder="Enter the verification code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            ) : isRegister ? (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
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
                <div className="mb-6">
                  <label
                    htmlFor="rePassword"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Re-type Password
                  </label>
                  <input
                    type="password"
                    name="rePassword"
                    id="rePassword"
                    placeholder="Re-enter your password"
                    value={formData.rePassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading
                ? isRegister
                  ? "Registering..."
                  : isVerify
                  ? "Verifying..."
                  : "Logging in..."
                : isRegister
                ? "Register"
                : isVerify
                ? "Verify"
                : "Log in"}
            </button>
          </form>

          {/* Chuyển giữa login và register */}
          <div className="flex justify-center mt-4">
            <NavLink
              to="#"
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={() => {
                setIsRegister(!isRegister);
                setIsVerify(false); // Đảm bảo không có chế độ xác thực khi chuyển đổi
              }}
            >
              {isRegister
                ? "Already have an account? Log in"
                : "Don't have an account? Register"}
            </NavLink>
          </div>

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
