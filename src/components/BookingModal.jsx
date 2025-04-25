import React, { useState, useEffect } from "react";
import { Modal, Button, List, Pagination } from "antd";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import useFetch from "../hooks/useFetch";
import { formatDate } from "../util/dateUtils"; // Giả sử bạn có hàm này để định dạng ngày
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookingModal = ({ open, onClose, hotelId, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [paginatedBookings, setPaginatedBookings] = useState([]);

  const fetchBookingsHook = useFetch(
    hotelId
      ? `${API_BASE_URL}/api/v1/owner/bookings/hotel/${hotelId}`
      : null
  );
  const {
    data: allBookings,
    loading,
    error,
    fetchData: fetchBookings,
  } = fetchBookingsHook;

  useEffect(() => {
    if (open && hotelId && token) {
      fetchBookings({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentPage(1);
    }
  }, [open, hotelId, token, fetchBookings]);

  useEffect(() => {
    if (allBookings) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedBookings(allBookings.slice(startIndex, endIndex));
    }
  }, [allBookings, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      title={"Bookings"}
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          className="bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
        >
          Close
        </Button>,
      ]}
      width={600}
      className="rounded-md overflow-hidden"
    >
      <div className="bg-gray-100 p-5 rounded-md">
        {loading && <LoadingSpinner text="Fetching bookings..." />}
        {error && (
          <p className="text-orange-500 mt-2 font-semibold">Error: {error}</p>
        )}
        {allBookings && allBookings.length === 0 && !loading && (
          <p className="text-blue-500 font-semibold">
            No bookings found for this hotel.
          </p>
        )}
        <List
          itemLayout="vertical"
          dataSource={paginatedBookings}
          renderItem={(item) => (
            <List.Item className="bg-white mb-4 rounded-md shadow-md p-4">
              <List.Item.Meta
                title={
                  <strong className="text-purple-700 pl-4">
                    Booking ID: {item.id}
                  </strong>
                }
                description={
                  <div className="leading-relaxed pl-4"> {/* Thêm padding bên trái */}
                    <div>
                      <strong className="text-cyan-500">Account:</strong>{" "}
                      {item.account?.fullName} (
                      <span className="text-gray-600">
                        {item.account?.email}
                      </span>
                      )
                    </div>
                    <div>
                      <strong className="text-cyan-500">Hotel:</strong>{" "}
                      <span className="text-gray-800">{item.hotel?.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <strong className="text-cyan-500">Start:</strong>{" "}
                        <span className="text-gray-800">
                          {formatDate(item.startDate)}
                        </span>
                      </div>
                      <div>
                        <strong className="text-cyan-500">End:</strong>{" "}
                        <span className="text-gray-800">
                          {formatDate(item.endDate)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-cyan-500">Price:</strong>{" "}
                      <span className="text-orange-500 font-semibold">
                        ${item.totalPrice}
                      </span>
                    </div>
                    <div>
                      <strong className="text-cyan-500">Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          item.status === "CONFIRMED"
                            ? "text-green-500"
                            : item.status === "CANCELLED"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <strong className="text-cyan-500">Created:</strong>{" "}
                      <span className="text-gray-600">
                        {formatDate(item.createDt)}
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {allBookings && allBookings.length > itemsPerPage && (
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={allBookings.length}
            onChange={handlePageChange}
            className="mt-6 flex justify-center"
            itemRender={(page, type, originalElement) => {
              if (type === "prev") {
                return (
                  <Button
                    size="small"
                    className="bg-blue-100 text-blue-500 hover:bg-blue-200 border-none"
                  >
                    Previous
                  </Button>
                );
              }
              if (type === "next") {
                return (
                  <Button
                    size="small"
                    className="bg-blue-100 text-blue-500 hover:bg-blue-200 border-none"
                  >
                    Next
                  </Button>
                );
              }
              return originalElement;
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;