import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities, fetchHotels } from "../store/searchSlice"; // Import fetchHotels
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import AmenitiesModal from "./AmenitiesModal";
import SortOptions from "./SortOptions";
import LoadingSpinner from "./Common/LoadingSpinner";

const Hotels = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const itemsPerPage = 4;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const selectedAmenities = useSelector(
    (state) => state.search.query.amenityNames || []
  );
  const sortBy = useSelector((state) => state.search.query.sortBy);
  const sortOrder = useSelector((state) => state.search.query.sortOrder);

  // Lấy query từ Redux store
  const query = useSelector((state) => state.search.query);

  const fetchHotelsData = () => {
    const baseUrl = "http://localhost:8080/api/v1/public/hotels";
    const params = new URLSearchParams();

    // Thêm các thông tin về sắp xếp vào params
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    selectedAmenities.forEach((amenity) =>
      params.append("amenityNames", amenity)
    );

    // Thêm các thông tin khác từ query vào params
    if (query.districtId) {
      params.append("districtId", query.districtId);
    }
    if (query.name) {
      params.append("name", query.name);
    }
    if (query.minPrice) {
      params.append("minPrice", query.minPrice);
    }
    if (query.maxPrice) {
      params.append("maxPrice", query.maxPrice);
    }
    if (query.startDate) {
      params.append("startDate", query.startDate);
    }
    if (query.endDate) {
      params.append("endDate", query.endDate);
    }

    const finalUrl = `${baseUrl}?${params.toString()}`;
    return dispatch(fetchHotels(finalUrl)); // Gọi fetchHotels với URL đã chuẩn bị
  };

  useEffect(() => {
    fetchHotelsData(); // Gọi API mỗi khi có thay đổi trong amenities, order hoặc criteria
  }, [selectedAmenities, sortBy, sortOrder, query, dispatch]);

  const hotels = useSelector((state) => state.search.hotels || []); // Thêm để lấy danh sách hotels từ Redux

  if (!hotels.length)
    return <LoadingSpinner />;

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
        <button
          onClick={showModal}
          className="px-4 py-2 border rounded-full bg-purple-600 text-white"
        >
          Filters by amenities ({selectedAmenities.length})
        </button>
        <SortOptions /> {/* Sử dụng component SortOptions */}
      </div>

      {/* Hiển thị modal amenities */}
      <AmenitiesModal open={isModalVisible} onClose={handleModalClose} />

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
