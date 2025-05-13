import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import usePost from "../hooks/usePost";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import loginImage from "../assets/image/login.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// login with Github
const githubLoginUrl = `${API_BASE_URL}/api/v1/public/login/github`;

// login with Google
const googleLoginUrl = `${API_BASE_URL}/api/v1/public/login/google`;

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
    newPassword: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [isVerifyForgot, setIsVerifyForgot] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Added state for forgot password
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error,
    user: loggedInUser,
    token,
  } = useSelector((state) => state.auth); // Lấy loggedInUser từ state

  // Call the custom hook for registration
  const {
    postData,
    loading: postLoading,
    error: postError,
  } = usePost(`${API_BASE_URL}/api/v1/public/sign-up`);

  // Call the custom hook for email verification
  const {
    postData: verifyEmail,
    loading: verifyLoading,
    error: verifyError,
  } = usePost(`${API_BASE_URL}/api/v1/public/verify-email`);

  // Call the custom hook for forgot password
  const {
    postData: forgotPassword,
    loading: forgotLoading,
    error: forgotError,
  } = usePost(`${API_BASE_URL}/api/v1/public/forgot-password`);

  // Call the custom hook for password reset
  const {
    postData: resetPassword,
    loading: resetLoading,
    error: resetError,
  } = usePost(`${API_BASE_URL}/api/v1/public/reset-password`);

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
        if (response) {
          setIsRegister(false);
          setIsVerify(true);
        } else {
          setIsRegister(true);
        }
      } catch (error) {
        console.error("Registration error", error);
      }
    } else if (isVerify) {
      const { email, verificationCode } = formData;

      try {
        const queryParams = new URLSearchParams({
          email: email,
          code: verificationCode,
        }).toString();

        const response = await verifyEmail(queryParams);
        if (response) {
          setIsVerify(false);
          navigate("/login", {
            state: { message: "Email verified, you can now log in!" },
          });
        } else {
          setIsVerify(true);
        }
      } catch (error) {
        console.error("Verification error", error);
      }
    } else if (isForgotPassword) {
      const { email } = formData;

      try {
        const response = await forgotPassword({ emailOrUsername: email });
        if (response) {
          setIsForgotPassword(false);
          setIsVerifyForgot(true); // Move to verification step
        }
      } catch (error) {
        console.error("Forgot password error", error);
      }
    } else if (isVerifyForgot) {
      const { email, verificationCode, newPassword, rePassword } = formData;
      try {
        const response = await resetPassword({
          email: email,
          code: verificationCode,
          newPassword: newPassword,
          rePassword: rePassword,
        });
        console.log("formdata: ", formData);
        console.log("response: ", response);

        if (response) {
          setIsVerifyForgot(false);
          navigate("/login", {
            state: { message: "Email verified, you can now log in!" },
          });
        } else {
          setIsVerifyForgot(true);
        }
      } catch (error) {
        console.error("Registration error", error);
      }
    } else {
      dispatch(loginUser(formData));
    }
  };

  // Theo dõi sự thay đổi của loggedInUser và token để chuyển hướng
  useEffect(() => {
    if (token) {
      console.log("User sau khi đăng nhập:", loggedInUser);
      if (loggedInUser?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate, loggedInUser, token]); // Chạy effect khi loggedInUser hoặc token thay đổi

  // Chuyển hướng nếu đã đăng nhập trước đó khi component mount
  useEffect(() => {
    if (token) {
      if (loggedInUser?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate, token, loggedInUser?.roles]);

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
              : isForgotPassword
              ? "Forgot Password"
              : isVerifyForgot
              ? "Reset password"
              : "Welcome Back! zzz"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isVerify
              ? "Enter the verification code sent to your email"
              : isRegister
              ? "Create a new account"
              : isForgotPassword
              ? "Enter your email to reset your password"
              : isVerifyForgot
              ? "Enter the verification code and password"
              : "Log in to your account"}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Forgot password email field */}
            {isForgotPassword ? (
              <div className="mb-6">
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
            ) : isVerify ? (
              <div>
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
            ) : isVerifyForgot ? (
              <div>
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
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
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
                {message && (
                  <p className="text-green-700 font-bold">{message}</p>
                )}
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
            {error && (
              <p className="text-red-600 text-sm mb-4 font-bold">{error}</p>
            )}
            {postError && (
              <p className="text-red-600 text-sm mb-4 font-bold">{postError}</p>
            )}
            {verifyError && (
              <p className="text-red-600 text-sm mb-4 font-bold">
                {verifyError}
              </p>
            )}
            {forgotError && (
              <p className="text-red-600 text-sm mb-4 font-bold">
                {forgotError}
              </p>
            )}
            {resetError && (
              <p className="text-red-600 text-sm mb-4 font-bold">
                {resetError}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={
                loading ||
                postLoading ||
                verifyLoading ||
                forgotLoading ||
                resetLoading
              }
              className="w-full py-3 mt-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              {loading ||
              postLoading ||
              verifyLoading ||
              forgotLoading ||
              resetLoading
                ? isForgotPassword
                  ? "Resetting Password..."
                  : isVerify
                  ? "Verifying..."
                  : isRegister
                  ? "Signing Up..."
                  : "Logging In..."
                : isForgotPassword
                ? "Reset Password"
                : isVerify
                ? "Verify"
                : isRegister
                ? "Sign Up"
                : isVerifyForgot
                ? "Reset password"
                : "Log In"}
            </button>

            {/* Switch between login and register */}
            <div className="flex items-center justify-between mt-6">
              {!isForgotPassword && !isVerifyForgot && !isVerify && (
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-sm text-indigo-500 hover:underline cursor-pointer"
                >
                  {isRegister
                    ? "Already have an account? Log In"
                    : "Don't have an account? Sign Up"}
                </button>
              )}

              {!isForgotPassword &&
                !isVerifyForgot &&
                !isRegister &&
                !isVerify && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-indigo-500 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
            </div>
          </form>
          {/* Social login buttons */}
          <div className="flex justify-around mt-6">
            <a
              href={googleLoginUrl}
              className="flex items-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              <GoogleOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "red" }}
              />
              Google
            </a>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <FacebookOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "blue" }}
              />{" "}
              Facebook
            </button>
            <a
              href={githubLoginUrl}
              className="flex items-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              <GithubOutlined
                className="mr-2 text-3xl"
                style={{ backgroundColor: "white", color: "black" }}
              />
              Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
