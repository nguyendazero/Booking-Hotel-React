import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function AdminDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch action logout từ Redux
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          className="logo"
          style={{
            height: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "white", margin: 0, fontSize: "20px" }}>
            Admin Panel
          </h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Users">
            <Menu.Item key="3">List Users</Menu.Item>
            <Menu.Item key="4">Add User</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Hotels">
            <Menu.Item key="6">List Hotels</Menu.Item>
            <Menu.Item key="8">Add Hotel</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Bookings
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: "0 16px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {/* Bạn có thể thêm thông báo hoặc thông tin người dùng ở đây */}
          <div></div> {/* Để tạo khoảng trống bên trái nút Logout */}
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, background: "#fff" }}
          >
            <h2>Admin Dashboard</h2>
            <p>Chào mừng đến trang quản trị!</p>
            {/* Thêm nội dung dashboard chi tiết tại đây */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboardPage;