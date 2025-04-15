import React from "react";
import { Layout } from "antd";
import AdminSidebar from "./AdminSidebar"; // Đảm bảo đường dẫn đúng
import { Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

function AdminRegistrationPendingPage() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible width={200} className="site-layout-background">
        <AdminSidebar />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <h1>Pending Registrations</h1>
            {/* Nội dung trang Pending Registrations sẽ được thêm vào đây */}
            <p>Đây là trang danh sách các đăng ký đang chờ xử lý.</p>
            {/* Nếu bạn có các route con cho trang Pending Registrations, Outlet sẽ hiển thị chúng */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminRegistrationPendingPage;