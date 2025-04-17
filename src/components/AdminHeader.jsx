import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Correct import
import { logout } from "../store/authSlice";

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Button icon={<LogoutOutlined />} onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default AdminHeader;