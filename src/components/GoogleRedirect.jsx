import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { completeGoogleLogin } from "../store/authSlice";
import { Spin, Result, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;

const GoogleRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      dispatch(completeGoogleLogin(code)) // Dispatch action completeGoogleLogin
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Đăng nhập Google thất bại:", error);
          setError("Đăng nhập Google không thành công. Vui lòng thử lại.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Mã xác thực không hợp lệ từ Google.");
      setLoading(false);
    }
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin
          size="large"
          indicator={
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <GoogleOutlined style={{ fontSize: 40 }} />{" "}
              {/* Sử dụng icon Google */}
            </motion.div>
          }
        />
        <Title level={4} style={{ marginTop: 20 }}>
          Đang xử lý đăng nhập với Google... {/* Thay đổi text */}
        </Title>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Result
          status="error"
          title="Đăng nhập Google thất bại"
          subTitle={error}
        />{" "}
        {/* Thay đổi text */}
      </motion.div>
    );
  }

  return null;
};

export default GoogleRedirect;
