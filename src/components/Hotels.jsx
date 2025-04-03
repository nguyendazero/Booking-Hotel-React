import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Pagination } from "antd";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Hotels = ({ hotels }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({});
  const itemsPerPage = 4;

  if (!hotels) return <LoadingSpinner tip="Fetching hotels..." />;
  if (hotels.length === 0) return <LoadingSpinner tip="Fetching hotels..." />;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hotels.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);

  const goToPrevImage = (hotelId, images) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[hotelId] ?? 0;
      return {
        ...prev,
        [hotelId]: currentIndex > 0 ? currentIndex - 1 : images.length - 1,
      };
    });
  };

  const goToNextImage = (hotelId, images) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[hotelId] ?? 0;
      return {
        ...prev,
        [hotelId]: currentIndex < images.length - 1 ? currentIndex + 1 : 0,
      };
    });
  };

  return (
    <div className="px-40 pt-5">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-purple-700">
          Discover Your <span className="text-purple-500">Perfect Stay</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Find the best hotels tailored to your{" "}
          <span className="font-semibold text-gray-800">budget</span> and
          <span className="font-semibold text-gray-800"> preferences</span>.
        </p>
      </div>

      <div className="flex justify-between mb-4">
        <button className="px-4 py-2 border rounded-full bg-purple-600 text-white">
          Filters (3)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map((hotel) => {
          const currentImageIndex = imageIndexes[hotel.id] || 0;

          return (
            <div
              key={hotel.id}
              className="border rounded-lg overflow-hidden shadow-md relative"
            >
              {hotel.discount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{hotel.discount.rate}% Limited
                </div>
              )}

              <div className="relative">
                {hotel.images.length > 0 ? (
                  <Link to={`/hotels/${hotel.id}`}>
                    <img
                      src={hotel.images[currentImageIndex]?.imageUrl}
                      alt={hotel.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105 hover:brightness-110"
                    />
                  </Link>
                ) : (
                  <Link to={`/hotels/${hotel.id}`}>
                    <img
                      src={hotel.highLightImageUrl}
                      alt={hotel.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105 hover:brightness-110"
                    />
                  </Link>
                )}
                <button
                  onClick={() => goToPrevImage(hotel.id, hotel.images)}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
                >
                  <LeftOutlined />
                </button>

                <button
                  onClick={() => goToNextImage(hotel.id, hotel.images)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
                >
                  <RightOutlined />
                </button>
              </div>

              <div className="p-4">
                <Link to={`/hotels/${hotel.id}`}>
                  <h2 className="font-bold text-lg">{hotel.name}</h2>
                </Link>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-purple-700 font-semibold">
                    ${hotel.pricePerDay} / night
                  </p>
                  <p className="text-yellow-500">
                    ⭐ {hotel.rating !== null ? hotel.rating.toFixed(1) : "N/A"}
                  </p>
                </div>
                <p className="text-gray-500">{hotel.streetAddress}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center p-5">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={hotels.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Hotels;
