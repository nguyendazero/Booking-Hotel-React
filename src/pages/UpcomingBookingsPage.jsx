import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import moment from "moment";

function UpcomingBookingsPage() {
  const {
    data: upcomingBookings,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/bookings");
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
      <p className="text-red-500 font-semibold">
        Error fetching upcoming bookings: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-md shadow-lg">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-purple-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-purple-500">Bookings</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-purple-700 font-semibold">Upcoming</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Upcoming Bookings
      </h1>
      {filteredUpcomingBookings && filteredUpcomingBookings.length > 0 ? (
        <List
          className="divide-y divide-gray-300"
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredUpcomingBookings}
          renderItem={(booking) => (
            <List.Item className="py-4">
              <Card
                className="bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
                title={
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-indigo-600">
                      Booking ID: {booking.id}
                    </span>
                    <span
                      className={`text-sm font-semibold text-green-500 bg-green-100 px-2 py-1 rounded-full`}
                    >
                      Upcoming
                    </span>
                  </div>
                }
              >
                <p className="text-gray-700">
                  <strong className="text-blue-500">Hotel:</strong>{" "}
                  <span className="font-medium">{booking.hotel.name}</span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Start Date:</strong>{" "}
                  <span className="font-medium">
                    {moment(booking.startDate).format("YYYY-MM-DD HH:mm:ss")}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">End Date:</strong>{" "}
                  <span className="font-medium">
                    {moment(booking.endDate).format("YYYY-MM-DD HH:mm:ss")}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Total Price:</strong>{" "}
                  <span className="font-semibold text-green-600">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Customer:</strong>{" "}
                  <span className="font-medium">
                    {booking.account.fullName} ({booking.account.email})
                  </span>
                </p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No upcoming bookings found.</p>
      )}
    </div>
  );
}

export default UpcomingBookingsPage;
