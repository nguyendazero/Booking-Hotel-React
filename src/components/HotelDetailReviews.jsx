import React, { useState } from "react";
import { StarFilled } from "@ant-design/icons";

// Hàm chuyển đổi ngày sang định dạng dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Tháng (0-11)
  const day = date.getDate(); // Ngày
  const year = date.getFullYear(); // Năm
  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};

const HotelDetailReviews = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false); // State để kiểm soát việc hiển thị toàn bộ danh sách

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p className="text-center text-gray-500">No reviews available.</p>;
  }

  // Giới hạn chỉ hiển thị 3 review nếu chưa bấm "Show more"
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="border rounded-lg p-6 shadow-md mt-4 mb-4 mx-50">
      <h2 className="text-xl font-bold mb-2">
        <span>Reviews</span> ({reviews.length} reviews)
      </h2>
      <p className="text-gray-600 mb-4">About the reviews for this hotel</p>
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="mt-4 space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="text-gray-800 mb-4 border-b pb-4">
            {/* Hiển thị tên người dùng và avatar */}
            <div className="flex items-center mb-2">
              <img
                src={review.account.avatar}
                alt={`${review.account.fullName}'s avatar`}
                className="w-10 h-10 object-cover rounded-full mr-3"
              />
              <div className="font-semibold text-lg">
                {review.account.fullName}
              </div>
              {/* Hiển thị ngày đăng review */}
              <div className="ml-auto text-sm text-gray-500">
                {formatDate(review.createDt)}
              </div>
            </div>

            {/* Hiển thị nội dung review */}
            <div className="text-gray-700 mb-2">{review.content}</div>

            {/* Hiển thị sao */}
            <div className="flex items-center mb-2">
              {[...Array(review.stars)].map((_, index) => (
                <StarFilled
                  key={index}
                  className="mr-1"
                  style={{ color: "#FFD700" }}
                />
              ))}
            </div>

            {/* Hiển thị hình ảnh nếu có */}
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex space-x-2">
                {review.images.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.imageUrl}
                    alt={`Review Image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chỉ hiển thị nút khi có hơn 3 review */}
      {reviews.length > 3 && (
        <div className="mt-4 text-center">
          <button
            className="text-purple-700 font-semibold cursor-pointer hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show more ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelDetailReviews;
