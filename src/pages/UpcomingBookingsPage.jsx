import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Pagination } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import moment from "moment";

function UpcomingBookingsPage() {
  const {
    data: allBookings, // Đổi tên thành allBookings để rõ ràng hơn
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/bookings");
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [paginatedUpcomingBookings, setPaginatedUpcomingBookings] = useState(
    []
  );
  const [filteredUpcomingBookings, setFilteredUpcomingBookings] = useState([]);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  // Filter bookings to get only upcoming ones
  useEffect(() => {
    if (allBookings) {
      const upcoming = allBookings.filter((booking) =>
        moment(booking.startDate).isAfter(moment())
      );
      setFilteredUpcomingBookings(upcoming);
      setCurrentPage(1); // Reset page when new data arrives
    }
  }, [allBookings]);

  useEffect(() => {
    if (filteredUpcomingBookings) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedUpcomingBookings(
        filteredUpcomingBookings.slice(startIndex, endIndex)
      );
    }
  }, [filteredUpcomingBookings, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        <>
          <List
            className="divide-y divide-gray-300"
            grid={{ gutter: 16, column: 1 }}
            dataSource={paginatedUpcomingBookings}
            renderItem={(booking) => (
              <List.Item className="py-4" key={booking.id}>
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
          {filteredUpcomingBookings.length > itemsPerPage && (
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredUpcomingBookings.length}
              onChange={handlePageChange}
              className="mt-6 flex justify-center"
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">No upcoming bookings found.</p>
      )}
    </div>
  );
}

export default UpcomingBookingsPage;
