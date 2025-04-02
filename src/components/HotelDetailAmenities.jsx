import React, { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const HotelDetailAmenities = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false); // State để kiểm soát việc hiển thị toàn bộ danh sách

  if (!Array.isArray(amenities) || amenities.length === 0) {
    return <p className="text-center text-gray-500">No amenities available.</p>;
  }

  // Giới hạn chỉ hiển thị 12 tiện ích nếu chưa bấm "View more"
  const displayedAmenities = showAll ? amenities : amenities.slice(0, 12);

  return (
    <div className="border rounded-lg p-6 shadow-md mx-50 mt-4 mb-4">
      <h2 className="text-xl font-bold">Amenities</h2>
      <p className="text-gray-600">
        About the property's amenities and services
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {displayedAmenities.map((amenity) => (
          <div key={amenity.id} className="text-gray-800">
            <CheckCircleOutlined className="mr-2" style={{ color: "green" }} />

            {amenity.name}
          </div>
        ))}
      </div>

      {/* Chỉ hiển thị nút khi có hơn 12 tiện ích */}
      {amenities.length > 12 && (
        <div className="mt-4 text-center">
          <button
            className="text-purple-700 font-semibold cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `View more ${amenities.length} amenities`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelDetailAmenities;
