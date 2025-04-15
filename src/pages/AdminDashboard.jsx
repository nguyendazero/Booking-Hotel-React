import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb, Button, Row, Col } from "antd";
import {
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
import AdminSidebar from "../components/AdminSidebar"; // Import the new sidebar component

const { Header, Content } = Layout;

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
      {/* Side bar */}
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />

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
