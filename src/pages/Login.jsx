import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import usePost from "../hooks/usePost";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import loginImage from "../assets/image/login.jpg";

const LoginForm = () => {

  const location = useLocation(); // Lấy đối tượng location
  const message = location.state?.message; // Lấy message từ location.state

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    fullName: "",
    username: "",
    email: "",
    rePassword: "",
    verificationCode: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Call the custom hook for registration
  const {
    postData,
    loading: postLoading,
    error: postError,
  } = usePost("http://localhost:8080/api/v1/public/sign-up");

  // Call the custom hook for email verification
  const {
    postData: verifyEmail,
    loading: verifyLoading,
    error: verifyError,
  } = usePost("http://localhost:8080/api/v1/public/verify-email");

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      try {
        const response = await postData(formData);
        console.log("formData", formData);
        console.log("Registration successful", response);
        setIsRegister(false);
        setIsVerify(true);
      } catch (error) {
        console.error("Registration error", error);
      }
    } else if (isVerify) {
      const { email, verificationCode } = formData;
      console.log("email: " + email + " " + verificationCode);

      try {
        // Truyền email và mã xác thực qua query parameters trong URL
        const queryParams = new URLSearchParams({
          email: email,
          code: verificationCode,
        }).toString();

        const response = await verifyEmail(queryParams);
        console.log("Verification successful", response);

        setIsVerify(false); // Đặt lại trạng thái verify thành false
        navigate("/login", {
          state: { message: "Successfully verified your account"},
        });
      } catch (error) {
        console.error("Verification error", error);
      }
    } else {
      dispatch(loginUser(formData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/"); // Redirect to homepage after login
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-fuchsia-300 to-fuchsia-300">
      <div className="flex w-4/5 max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Login or Register form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isVerify
              ? "Verify Your Account"
              : isRegister
              ? "Create an Account"
              : "Welcome Back!"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isVerify
              ? "Enter the verification code sent to your email"
              : isRegister
              ? "Create a new account"
              : "Log in to your account"}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Form fields for register or verify */}
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
                {/* Registration form fields */}
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
                {/* Login form fields */}
                {message && <p className="text-green-700 font-bold">{message}</p>} {/* Hiển thị thông báo nếu có */}
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

            {/* Display errors for login, register, or verify */}
            {error && <p className="text-red-600 text-sm mb-4 font-bold">{error}</p>}
            {postError && (
              <p className="text-red-500 text-sm mb-4">{postError}</p>
            )}
            {verifyError && (
              <p className="text-red-500 text-sm mb-4">{verifyError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 cursor-pointer"
              disabled={loading || postLoading || verifyLoading}
            >
              {loading || postLoading || verifyLoading
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

          {/* Toggle between login and register */}
          <div className="flex justify-center mt-4">
            <NavLink
              to="#"
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={() => {
                setIsRegister(!isRegister);
                setIsVerify(false);
              }}
            >
              {isRegister
                ? "Already have an account? Log in"
                : "Don't have an account? Register"}
            </NavLink>
          </div>

          {/* Social login buttons */}
          <div className="flex justify-around mt-6">
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <GoogleOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "red" }}
              />{" "}
              Google
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <FacebookOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "blue" }}
              />{" "}
              Facebook
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <GithubOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "black" }}
              />{" "}
              Github
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
