import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb, Button, Row, Col } from "antd";
import ChartCurrentMonth from "../components/ChartCurrentMonth";
import ChartYearlyBookings from "../components/ChartYearlyBookings";
import ChartYearlyRevenue from "../components/ChartYearlyRevenue";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Content } = Layout;

const dashboardCardStyle = {
  marginBottom: 24,
};

function AdminDashboardPage() {
  const token = useSelector((state) => state.auth.token);
  const {
    data: bookings,
    loading,
    error,
    fetchData: fetchBookings,
  } = useFetch(`${API_BASE_URL}/api/v1/admin/bookings`);

  useEffect(() => {
    fetchBookings({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchBookings, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-600 font-bold">
        Error fetching bookings: {error}
      </p>
    );
  }

  return (
    <Content style={{ margin: "0 16px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, background: "#fff" }}
      >
        {bookings ? (
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
  );
}

export default AdminDashboardPage;