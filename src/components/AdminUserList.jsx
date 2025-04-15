import React from "react";
import { Layout } from "antd";
import AdminSidebar from "./AdminSidebar"; // Đảm bảo đường dẫn đúng
import { Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

function AdminUserList() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible width={200} className="site-layout-background">
        <AdminSidebar />
      </Sider>
      <Layout className="site-layout">
        {/* Bạn có thể thêm Header ở đây nếu cần */}
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <h1>User List</h1>
            {/* Nội dung trang User List sẽ được thêm vào đây */}
            <p>Đây là trang danh sách người dùng.</p>
            {/* Nếu bạn có các route con cho trang User List, Outlet sẽ hiển thị chúng */}
            <Outlet />
          </div>
        </Content>
        {/* Bạn có thể thêm Footer ở đây nếu cần */}
      </Layout>
    </Layout>
  );
}

export default AdminUserList;