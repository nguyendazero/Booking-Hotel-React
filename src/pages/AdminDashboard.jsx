import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Button, Row, Col, Card } from "antd";
import {
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import ChartCurrentMonth from "../components/ChartCurrentMonth";
import ChartYearlyBookings from "../components/ChartYearlyBookings";
import ChartYearlyRevenue from "../components/ChartYearlyRevenue";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const dashboardCardStyle = {
  marginBottom: 24,
};

function AdminDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const {
    data: bookings,
    loading,
    error,
    fetchData: fetchBookings,
  } = useFetch("http://localhost:8080/api/v1/admin/bookings");

  useEffect(() => {
    fetchBookings({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchBookings, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
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
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="text-red-600 font-bold">
                Error fetching bookings: {error}
              </p>
            ) : bookings ? (
              <Row gutter={24}>
                <Col span={12} style={dashboardCardStyle}>
                  <ChartCurrentMonth bookings={bookings} type="revenue" />
                </Col>
                <Col span={12} style={dashboardCardStyle}>
                  <ChartCurrentMonth bookings={bookings} type="bookings" />
                </Col>
                <Col span={24} style={dashboardCardStyle}>
                  <ChartYearlyBookings bookings={bookings} />
                </Col>
                <Col span={24} style={dashboardCardStyle}>
                  <ChartYearlyRevenue bookings={bookings} />
                </Col>
              </Row>
            ) : (
              <p>No booking data available.</p>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboardPage;