import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import moment from "moment";

function AllBookingsPage() {
  const {
    data: allBookings,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/bookings");
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [paginatedBookings, setPaginatedBookings] = useState([]);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  useEffect(() => {
    if (allBookings) {
      const results = allBookings.filter(
        (booking) =>
          booking.id.toString().includes(searchTerm.toLowerCase()) ||
          booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.account.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.account.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          moment(booking.startDate)
            .format("YYYY-MM-DD HH:mm:ss")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          moment(booking.endDate)
            .format("YYYY-MM-DD HH:mm:ss")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(results);
      setCurrentPage(1); // Reset page when search term changes
    }
  }, [allBookings, searchTerm]);

  useEffect(() => {
    if (filteredBookings) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedBookings(filteredBookings.slice(startIndex, endIndex));
    }
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-green-100 rounded-md shadow-lg">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-blue-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-blue-500">Bookings</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-blue-700 font-semibold">All</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">All Bookings</h1>
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search by ID, Customer, Hotel, Date, Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 font-semibold">
          Error fetching bookings: {error}
        </p>
      ) : filteredBookings && filteredBookings.length > 0 ? (
        <>
          <List
            className="divide-y divide-gray-300"
            grid={{ gutter: 16, column: 1 }}
            dataSource={paginatedBookings}
            renderItem={(booking) => (
              <List.Item className="py-4" key={booking.id}>
                <Card
                  className="bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-teal-600">
                        Booking ID: {booking.id}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "text-green-500 bg-green-100"
                            : booking.status === "CHECKOUT"
                            ? "text-orange-500 bg-orange-100"
                            : "text-gray-600 bg-gray-100"
                        } px-2 py-1 rounded-full`}
                      >
                        {booking.status}
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
          {filteredBookings.length > itemsPerPage && (
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredBookings.length}
              onChange={handlePageChange}
              className="mt-6 flex justify-center"
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">
          {searchTerm
            ? "No bookings found matching your search."
            : "No bookings found."}
        </p>
      )}
    </div>
  );
}

export default AllBookingsPage;
