import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import moment from "moment"; // For date formatting

function AllBookingsPage() {
  const {
    data: upcomingBookings,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/bookings"); // Use the same endpoint for all bookings
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  // Filter bookings to get only upcoming ones
  const filteredUpcomingBookings = upcomingBookings
    ? upcomingBookings.filter((booking) =>
        moment(booking.startDate).isAfter(moment())
      )
    : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-600 font-bold">
        Error fetching upcoming bookings: {error}
      </p>
    );
  }

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360, background: "#fff" }}
    >
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Bookings</Breadcrumb.Item>
        <Breadcrumb.Item>Upcoming</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Upcoming Bookings</h1>
      {filteredUpcomingBookings && filteredUpcomingBookings.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredUpcomingBookings}
          renderItem={(booking) => (
            <List.Item>
              <Card
                title={`Booking ID: ${booking.id}`}
                style={{ width: "100%" }}
              >
                <p>
                  <strong>Hotel:</strong> {booking.hotel.name}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {moment(booking.startDate).format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {moment(booking.endDate).format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p>
                  <strong>Total Price:</strong> {booking.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p>
                  <strong>Customer:</strong> {booking.account.fullName} (
                  {booking.account.email})
                </p>
                {/* Display other booking details as needed */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No upcoming bookings found.</p>
      )}
    </div>
  );
}

export default AllBookingsPage;
