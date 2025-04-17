import React, { useState } from "react";
import { Layout } from "antd";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <AdminHeader />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Outlet /> {/* Đảm bảo Outlet tồn tại */}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;