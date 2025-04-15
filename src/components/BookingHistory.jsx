import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../util/dateUtils";

const BookingHistory = ({ bookings }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-8">
        Booking <span className="text-purple-500">History</span>
      </h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hotel
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dates
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="transition-transform duration-300 transform hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          booking.hotel.highLightImageUrl ||
                          "https://via.placeholder.com/150"
                        }
                        alt={booking.hotel.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors duration-200">
                        <Link to={`/hotels/${booking.hotel.id}`}>
                          {booking.hotel.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 italic">
                  {booking.hotel.streetAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                  {`${formatDate(booking.startDate)} - ${formatDate(
                    booking.endDate
                  )}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {`${booking.totalPrice.toLocaleString()} USD`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                  {booking.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link to={`/hotels/${booking.hotel.id}`}>
                    <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Rebook the hotel
                    </button>
                  </Link>
                  <Link to={`/hotels/${booking.hotel.id}`}>
                    <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Review
                    </button>
                  </Link>
                  {booking.status === "CHECKOUT" ||
                  booking.status === "CHECKIN" ? (
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Delete
                    </button>
                  ) : (
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <p className="text-gray-600 text-center mt-6">
          No booking history available.
        </p>
      )}
    </div>
  );
};

export default BookingHistory;
