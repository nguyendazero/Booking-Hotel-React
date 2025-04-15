import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  PieChart,
  Users,
  Building,
  UserPlus,
  CalendarCheck,
} from "lucide-react";

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
        <Menu.Item key="1" icon={<PieChart />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<Users />} title="Users">
          <Menu.Item key="3">
            <Link to="/admin/users">List Users</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<Building />} title="Hotels">
          <Menu.Item key="5">
            <Link to="/admin/hotels">List Hotels</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<UserPlus />} title="Registrations">
          <Menu.Item key="7">
            <Link to="/admin/registration">List Registration</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<CalendarCheck />}>
          <Link to="/admin/bookings">Bookings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default AdminSidebar;
