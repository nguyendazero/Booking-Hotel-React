import React from "react";
import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom"; // Nếu bạn muốn dùng Link cho điều hướng

const { Sider } = Layout;
const { SubMenu } = Menu;

function AdminSidebar({ collapsed, onCollapse }) {
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
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
          {/* Nếu bạn muốn dùng Link để điều hướng */}
          {/* <Link to="/admin" /> */}
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Users">
          <Menu.Item key="3">List Users</Menu.Item>
          {/* <Link to="/admin/users" /> */}
          <Menu.Item key="4">Add User</Menu.Item>
          {/* <Link to="/admin/users/add" /> */}
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Hotels">
          <Menu.Item key="6">List Hotels</Menu.Item>
          {/* <Link to="/admin/hotels" /> */}
          <Menu.Item key="8">Add Hotel</Menu.Item>
          {/* <Link to="/admin/hotels/add" /> */}
        </SubMenu>
        <SubMenu key="sub3" icon={<TeamOutlined />} title="Owner Registration">
          <Menu.Item key="6">List Registration</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
          Bookings
          {/* <Link to="/admin/bookings" /> */}
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default AdminSidebar;
