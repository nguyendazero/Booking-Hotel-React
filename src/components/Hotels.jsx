import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { Pagination } from "antd";

const Hotels = () => {
  const { data: hotels, loading, error } = useFetch("http://localhost:8080/api/v1/public/hotels");
  const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 4;
  const itemsPerPage = 4;

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div>Error fetching hotels: {error.message}</div>;
  }

  // Tính toán các mục hiện tại để hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hotels.slice(indexOfFirstItem, indexOfLastItem);

  console.log(hotels.length);
  
  // Tính tổng số trang
  const totalItems = hotels.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-40 pt-5">
      {/* Phần giới thiệu */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <p className="text-gray-600">Search hotels according to your preferences</p>
      </div>

      {/* Phần bộ lọc */}
      <div className="flex justify-between mb-4">
        <button className="px-4 py-2 border rounded-full bg-purple-600 text-white">
          Filters (3)
        </button>
      </div>

      {/* Hiển thị danh sách khách sạn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map((hotel) => (
          <div key={hotel.id} className="border rounded-lg overflow-hidden shadow-md">
            <img
              src={hotel.highLightImageUrl}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{hotel.name}</h2>
              <p className="text-purple-700 font-semibold">${hotel.pricePerDay.toFixed(2)} / night</p>
              <p className="text-yellow-500">⭐ {hotel.rating !== null ? hotel.rating.toFixed(1) : "N/A"}</p>
              <p className="text-gray-500">{hotel.streetAddress}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phần phân trang */}
      <div className="flex justify-center p-5">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false} // Ẩn tùy chọn thay đổi số lượng mục mỗi trang
        />
      </div>
    </div>
  );
};

export default Hotels;