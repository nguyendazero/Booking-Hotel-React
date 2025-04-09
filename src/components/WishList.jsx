import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useDelete from "../hooks/useDelete";
import { message } from "antd";
import { Trash2 } from "lucide-react";

const WishList = ({ wishList, onRemoveHotel }) => {
  const token = useSelector((state) => state.auth.token);
  const { deleteData, loading: deleting, error: deleteError } = useDelete();

  const handleRemoveFromWishlist = async (hotelIdToRemove) => {
    if (!token) {
      message.error("Please log in to remove from your favorites.");
      return;
    }

    const confirmRemove = window.confirm(
      "Are you sure you want to remove this hotel from your favorites?"
    );

    if (confirmRemove) {
      const deleteUrl = `http://localhost:8080/api/v1/user/wishlist/${hotelIdToRemove}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await deleteData(deleteUrl, config);

      if (response && response.status === 204) {
        message.success("Hotel removed from your favorites!");
        if (onRemoveHotel) {
          onRemoveHotel(hotelIdToRemove);
        }
      } else if (deleteError) {
        message.error(`Failed to remove from favorites: ${deleteError}`);
      }
    }
  };

  return (
    <div className="my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-8 tracking-tight sm:text-4xl">
        Favorite <span className="text-purple-500">Hotels</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(wishList) &&
          wishList.map((hotel) => (
            <div
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 relative"
              key={hotel.id}
            >
              <Link to={`/hotels/${hotel.id}`} className="group block">
                <div className="relative overflow-hidden">
                  <img
                    className="w-full h-40 sm:h-56 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    src={hotel.highLightImageUrl}
                    alt={hotel.name}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </Link>
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="font-semibold text-xl text-gray-900 mb-2 truncate">
                  {hotel.name}
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-gray-700 text-sm sm:text-base">
                    Price:
                  </span>
                  <span className="font-medium text-purple-600 text-sm sm:text-base">
                    ${hotel.pricePerDay}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-600 text-sm sm:text-base">
                    Rating:
                  </span>
                  <span className="font-medium text-yellow-600 text-sm sm:text-base">
                    {hotel.rating}
                  </span>
                  <span className="text-yellow-500 text-sm sm:text-base">
                    ⭐
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 sm:px-6 sm:pb-4 flex justify-between items-center">
                <Link to={`/hotels/${hotel.id}`} className="w-45 sm:w-auto">
                  <button className="bg-orange-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 w-full text-center">
                    Learn More
                  </button>
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(hotel.id)}
                  className={`text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200 ml-2 ${
                    deleting
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  disabled={deleting}
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        {Array.isArray(wishList) && wishList.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600 text-lg">
              No hotels added to your favorites yet.
            </p>
            <Link to="/hotels">
              <button
                type="primary"
                className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 mt-4"
              >
                Browse Hotels
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;