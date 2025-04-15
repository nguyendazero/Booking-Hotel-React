import React from "react";
import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import {
  Users,
  Building,
  UserPlus,
  CalendarCheck,
  MapPin, // Icon for Regions
  Settings, // Icon for Configs
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
      <Menu theme="dark" defaultSelectedKeys={["dashboard"]} mode="inline">
        <Menu.Item key="dashboard">
          <NavLink to="/admin" activeClassName="ant-menu-item-selected">
            Dashboard
          </NavLink>
        </Menu.Item>
        <SubMenu key="users" icon={<Users />} title="Users">
          <Menu.Item key="userList">
            <NavLink to="/admin/users" activeClassName="ant-menu-item-selected">
              User List
            </NavLink>
          </Menu.Item>
          <Menu.Item key="blockedUsers">
            <NavLink
              to="/admin/users/blocked"
              activeClassName="ant-menu-item-selected"
            >
              Blocked Users
            </NavLink>
          </Menu.Item>
          <Menu.Item key="hotelOwners">
            <NavLink
              to="/admin/users/owners"
              activeClassName="ant-menu-item-selected"
            >
              Hotel Owners
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="hotels" icon={<Building />} title="Hotels">
          <Menu.Item key="hotelList">
            <NavLink
              to="/admin/hotels"
              activeClassName="ant-menu-item-selected"
            >
              Hotel List
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="registrations" icon={<UserPlus />} title="Registrations">
          <Menu.Item key="pendingRegistrations">
            <NavLink
              to="/admin/registrations/pending"
              activeClassName="ant-menu-item-selected"
            >
              Pending
            </NavLink>
          </Menu.Item>
          <Menu.Item key="acceptedRegistrations">
            <NavLink
              to="/admin/registrations/accepted"
              activeClassName="ant-menu-item-selected"
            >
              Accepted
            </NavLink>
          </Menu.Item>
          <Menu.Item key="rejectedRegistrations">
            <NavLink
              to="/admin/registrations/rejected"
              activeClassName="ant-menu-item-selected"
            >
              Rejected
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="bookings" icon={<CalendarCheck />} title="Bookings">
          <Menu.Item key="allBookings">
            <NavLink
              to="/admin/bookings/all"
              activeClassName="ant-menu-item-selected"
            >
              All Bookings
            </NavLink>
          </Menu.Item>
          <Menu.Item key="upcomingBookings">
            <NavLink
              to="/admin/bookings/upcoming"
              activeClassName="ant-menu-item-selected"
            >
              Upcoming Bookings
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="regions" icon={<MapPin />} title="Regions">
          <Menu.Item key="regionList">
            <NavLink
              to="/admin/regions/all"
              activeClassName="ant-menu-item-selected"
            >
              Region List
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="configs" icon={<Settings />} title="Configs">
          <Menu.Item key="configList">
            <NavLink
              to="/admin/configs/all"
              activeClassName="ant-menu-item-selected"
            >
              Config List
            </NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}

export default AdminSidebar;