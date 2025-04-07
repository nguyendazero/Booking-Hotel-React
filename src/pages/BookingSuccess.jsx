import React from "react";
import { Button } from "antd";
import tokyoImage from "../assets/image/tokyo.webp";
import { Link } from "react-router-dom";

const BookingSuccessPage = () => {
  // Dữ liệu đặt phòng
  const bookingData = {
    roomImage: "https://example.com/room.jpg", // URL hình ảnh phòng
    roomDescription: "Hotel room in Tokyo, Japan",
    hotelLocation: "Tokyo, Japan",
    roomName: "The Lounge & Bar",
    rating: 4.5,
    checkInDate: "Aug 12",
    checkOutDate: "Aug 16, 2021",
    guests: "3",
    bookingCode: "#222-333-111",
    totalPrice: 199,
    paymentMethod: "Credit card",
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Congratulations 🎉</h1>
      <h2 className="text-xl font-semibold mb-6">Your booking</h2>

      <div className="flex w-full max-w-3xl space-x-8">
        {/* Cột 1 */}
        <div className="bg-white shadow-md rounded-md overflow-hidden w-1/2">
          <img
            alt="room"
            src={tokyoImage}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">{bookingData.roomName}</h3>
            <p className="text-gray-600">{bookingData.roomDescription}</p>
            <p className="text-gray-500">{bookingData.hotelLocation}</p>
            <p className="text-yellow-500">{bookingData.rating} ★</p>
            <p className="text-gray-700">{bookingData.guests} Guests</p>
            <p className="text-gray-700">
              Date: {bookingData.checkInDate} - {bookingData.checkOutDate}
            </p>
          </div>
        </div>

        {/* Cột 2 */}
        <div className="flex flex-col justify-between w-1/2 p-6  shadow-md rounded-md">
          <h3 className="text-xl font-serif font-bold text-center">
            Booking Detail
          </h3>
          <div className="mb-4">
            <p className="text-gray-700">
              <span className="font-bold">Booking code:</span>{" "}
              {bookingData.bookingCode}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Date:</span> {bookingData.checkInDate}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Total:</span> $
              {bookingData.totalPrice}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Payment method:</span>{" "}
              {bookingData.paymentMethod}
            </p>
          </div>
          <Link to={"/"}>
            <Button
              type="primary"
              style={{ backgroundColor: "#6c63ff", borderColor: "#6c63ff" }}
            >
              Explore more stays
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
