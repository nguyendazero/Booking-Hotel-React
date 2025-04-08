import React, { useState } from "react";
import { Button, message } from "antd";
import { Link } from "react-router-dom";
import { formatDate } from "../util/dateUtils";
import usePut from "../hooks/usePut";
import { useSelector } from "react-redux";

const CheckinHotel = ({ bookings }) => {
  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const { putData, loading, error } = usePut();

  const handleCancelBooking = async (bookingId) => {
    setLoadingBookingId(bookingId);

    try {
      const url = `http://localhost:8080/api/v1/user/booking/${bookingId}/cancel`;

      const response = await putData(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        url
      );
    
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
    setLoadingBookingId(null);
  };

  const handleButtonClick = (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) {
      handleCancelBooking(bookingId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-md mt-6">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-5">
        Your Upcoming <span className="text-purple-500">Check-ins</span>
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex border border-gray-300 rounded-md bg-gray-50 shadow-sm p-5 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={booking.hotel.highLightImageUrl || "default_image_url.jpg"}
              alt={booking.hotel.name}
              className="w-70 h-50 rounded-md mr-5 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition duration-200">
                {booking.hotel.name}
              </h3>
              <p className="text-gray-500 text-sm italic mb-1">
                Location: {booking.hotel.streetAddress}
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Price:{" "}
                <span className="font-bold text-green-700">
                  {booking.totalPrice} $
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.status === "CONFIRMED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <p className="text-gray-500 text-xs">
                Start Date:{" "}
                <span className="font-medium text-gray-700">
                  {formatDate(booking.startDate)}
                </span>
              </p>
              <p className="text-gray-500 text-xs">
                End Date:{" "}
                <span className="font-medium text-gray-700">
                  {formatDate(booking.endDate)}
                </span>
              </p>
              <div className="mt-5">
                <Link to={`/hotels/${booking.hotel.id}`}>
                  <Button color="purple" variant="solid" className="mr-1.5">
                    View
                  </Button>
                </Link>
                {booking.status !== "CANCELLED" && (
                  <Button
                    color="danger"
                    variant="solid"
                    onClick={() => handleButtonClick(booking.id)} // Call the new button click handler
                    loading={loadingBookingId === booking.id} // Check loading state for this booking
                    disabled={loadingBookingId === booking.id} // Disable button when loading
                  >
                    {loadingBookingId === booking.id
                      ? "Cancelling..."
                      : "Cancel"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckinHotel;
