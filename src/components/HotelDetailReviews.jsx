import React, { useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { formatDate } from "../util/dateUtils";

const HotelDetailReviews = ({
  reviews,
  onAddReview,
  isSubmitting,
  reviewError,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isAddingReviewModalOpen, setIsAddingReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const displayedReviews = showAll
    ? Array.isArray(reviews)
      ? reviews
      : []
    : Array.isArray(reviews)
    ? reviews.slice(0, 3)
    : [];

  const openAddReviewModal = () => {
    setIsAddingReviewModalOpen(true);
  };

  const closeAddReviewModal = () => {
    setIsAddingReviewModalOpen(false);
    setRating(0);
    setComment("");
    setImages([]);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleAddReviewSubmit = () => {
    if (rating > 0 && comment.trim()) {
      onAddReview({ stars: rating, content: comment, images: images });
    } else {
      alert("Please provide a rating and a comment.");
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-md mt-4 mb-4 mx-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          <span>Reviews</span> ({Array.isArray(reviews) ? reviews.length : 0}{" "}
          reviews)
        </h2>
        <button
          className={`bg-purple-500 hover:bg-purple-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={isSubmitting ? () => {} : openAddReviewModal}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Review..." : "Add Review"}
        </button>
      </div>
      <p className="text-gray-600 mb-4">About the reviews for this hotel</p>
      <hr className="border-t-2 border-gray-300 my-4" />

      {/* Add Review Modal */}
      {isAddingReviewModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8 z-50">
            {/* Display error message */}
            {reviewError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{reviewError}</span>
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Add Your Review
            </h3>

            {/* Rating Section */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className="cursor-pointer transition-transform transform hover:scale-110"
                    onClick={() => handleStarClick(index + 1)}
                  >
                    {index < rating ? (
                      <StarFilled
                        style={{ color: "#FACC15", fontSize: "1.5em" }}
                      />
                    ) : (
                      <StarOutlined
                        style={{ fontSize: "1.5em", color: "#D1D5DB" }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Comment
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                rows="4"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Write your thoughts about the hotel..."
              />
            </div>

            {/* Image Upload Section */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Add Images (optional)
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer font-semibold py-2 px-4 rounded-xl shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                onClick={closeAddReviewModal}
              >
                Cancel
              </button>
              <button
                className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 cursor-pointer px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleAddReviewSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {Array.isArray(reviews) && reviews.length > 0 && (
        <div className="mt-4 space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="text-gray-800 mb-4 border-b pb-4">
              <div className="flex items-center mb-2">
                <img
                  src={review.account?.avatar}
                  alt={`${review.account?.fullName}'s avatar`}
                  className="w-10 h-10 object-cover rounded-full mr-3"
                />
                <div className="font-semibold text-lg">
                  {review.account?.fullName}
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {formatDate(review.createDt)}
                </div>
              </div>

              <div className="text-gray-700 mb-2">{review.content}</div>

              <div className="flex items-center mb-2">
                {[...Array(review.stars)].map((_, index) => (
                  <StarFilled
                    key={index}
                    className="mr-1"
                    style={{ color: "#FFD700" }}
                  />
                ))}
              </div>

              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex space-x-2">
                  {review.images.map((image, index) => (
                    <img
                      key={image?.id || index}
                      src={image?.imageUrl}
                      alt={`Review Image ${index + 1}`}
                      className="w-auto h-40 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(reviews) && reviews.length > 3 && (
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
