import React, { useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { formatDate } from "../util/dateUtils";

const HotelDetailReviews = ({ reviews, onAddReview, isSubmitting }) => {
  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p className="text-center text-gray-500">No reviews available.</p>;
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store selected files in the state
  };

  const handleAddReview = () => {
    if (rating > 0 && comment.trim()) {
      onAddReview({ stars: rating, content: comment, images: images });
      setComment("");
      setImages([]); // Clear selected images after submission
    } else {
      alert("Please provide a rating and a comment.");
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-md mt-4 mb-4 mx-50">
      <h2 className="text-xl font-bold mb-2">
        <span>Reviews</span> ({reviews.length} reviews)
      </h2>
      <p className="text-gray-600 mb-4">About the reviews for this hotel</p>
      <hr className="border-t-2 border-gray-300 my-4" />

      {/* Form to add a new review */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Add Your Review</h3>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating:
          </label>
          <div>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="cursor-pointer"
                onClick={() => handleStarClick(index + 1)}
              >
                {index < rating ? (
                  <StarFilled style={{ color: "#FFD700", fontSize: "1.2em" }} />
                ) : (
                  <StarOutlined style={{ fontSize: "1.2em" }} />
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Comment:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Add Images (optional):
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

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