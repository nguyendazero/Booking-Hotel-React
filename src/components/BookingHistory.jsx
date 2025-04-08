import { Button } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { formatDate } from "../util/dateUtils";

const BookingHistory = ({ bookings }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-8">
        Booking <span className="text-purple-500">History</span>
      </h1>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white shadow-lg rounded-lg p-6 mb-6 flex flex-col md:flex-row transition-transform duration-300 transform hover:shadow-xl"
        >
          {/* Hotel image */}
          <div className="flex-shrink-0">
            <img
              src={
                booking.hotel.highLightImageUrl ||
                "https://via.placeholder.com/150"
              }
              alt={booking.hotel.name}
              className="w-64 h-40 object-cover rounded-lg"
            />
          </div>
          <div className="ml-6 flex-grow">
            <h3 className="text-2xl font-bold text-purple-800 hover:text-purple-600 transition-colors duration-200 mb-2">
              {booking.hotel.name}
            </h3>
            <p className="text-gray-500 mt-1 text-lg italic">
              {booking.hotel.streetAddress}
            </p>{" "}
            {/* Địa chỉ khách sạn */}
            <p className="text-blue-600 mt-1 text-lg font-semibold">
              {`Dates: ${formatDate(booking.startDate)} - ${formatDate(
                booking.endDate
              )}`}
            </p>
            <p className="text-green-600 mt-1 text-lg font-semibold">
              {`Total Price: ${booking.totalPrice.toLocaleString()} USD`}
            </p>
            <p className="text-yellow-600 mt-1 text-lg font-semibold">
              {`Status: ${booking.status}`}
            </p>
          </div>
          <div className="mt-5 flex flex-col md:flex-row items-start md:items-center">
            <Link to={`/hotels/${booking.hotel.id}`}>
              <Button color="purple" variant="solid" className="mr-1.5">
                View
              </Button>
            </Link>
            <Link to={`/hotels/${booking.hotel.id}`}>
              <Button color="cyan" variant="solid" className="mr-1.5">
                Review
              </Button>
            </Link>
            {booking.status === "CHECKOUT" || booking.status === "CHECKIN" ? (
              <Button color="danger" variant="solid">
                Delete
              </Button>
            ) : (
              <Button color="danger" variant="solid">
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
