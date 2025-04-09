import React from "react";
import { Link } from "react-router-dom";

const WishList = ({ wishList }) => {
  return (
    <div className="my-8 mx-50">
      <h1 className="text-5xl font-extrabold text-purple-700 text-center mb-8 tracking-tight">
        Favorite <span className="text-purple-500">Hotels</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(wishList) &&
          wishList.map((hotel) => (
            <div
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
              key={hotel.id}
            >
              <Link to={`/hotels/${hotel.id}`}>
                <img
                  className="w-full h-40 sm:h-55 object-cover cursor-pointer"
                  src={hotel.highLightImageUrl}
                  alt={hotel.name}
                />
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
              <div className="px-4 pb-3 sm:px-6 sm:pb-4">
                <Link to={`/hotels/${hotel.id}`}>
                  <button className="bg-orange-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 w-full text-center">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WishList;
