// HotelDetailPage.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HotelDetailImages from "../components/HotelDetailImages";
import HotelDetailInfo from "../components/HotelDetailInfo";
import HotelDetailReserve from "../components/HotelDetailReserve";
import HotelDetailAmenities from "../components/HotelDetailAmenities";
import HotelDetailReviews from "../components/HotelDetailReviews";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import OpenLayersMap from "../components/OpenLayersMap";
import usePost from "../hooks/usePost"; // Import usePost hook
import { useSelector } from "react-redux"; // Import useSelector to get token

function HotelDetailPage() {
  const { hotelId } = useParams();
  const token = useSelector((state) => state.auth.token);

  const [hotel, setHotel] = useState(null);
  const [discounts, setDiscounts] = useState(null);
  const [amenities, setAmenities] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const {
    postData: postReview,
    loading: postReviewLoading,
    error: postReviewError,
  } = usePost(`http://localhost:8080/api/v1/user/hotel/rating`);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const hotelRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}`
        );
        if (!hotelRes.ok) throw new Error("Failed to fetch hotel");
        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        const discountRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}/discounts`
        );
        if (!discountRes.ok) throw new Error("Failed to fetch discounts");
        const discountData = await discountRes.json();
        setDiscounts(discountData);

        const amenityRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}/amenities`
        );
        if (!amenityRes.ok) throw new Error("Failed to fetch amenities");
        const amenityData = await amenityRes.json();
        setAmenities(amenityData);

        const reviewRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}/ratings`
        );
        if (!reviewRes.ok) throw new Error("Failed to fetch reviews");
        const reviewData = await reviewRes.json();
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  const handleAddReviewSubmit = async (newReview) => {
    if (!token) {
      alert("Please log in to add a review.");
      return;
    }

    setIsAddingReview(true); // Set isAddingReview to true when starting submission
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("hotelId", hotelId);
    formData.append("stars", newReview.stars);
    formData.append("content", newReview.content);

    // Append images if they exist in newReview
    if (newReview.images && newReview.images.length > 0) {
      newReview.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const responseData = await postReview(formData, config);

    if (responseData) {
      setReviews([...(reviews || []), responseData]);
      alert("Review added successfully!");
    } else if (postReviewError) {
      console.error(postReviewError);
    }

    setIsAddingReview(false); // Set isAddingReview back to false after submission (success or error)
  };

  const handleReviewDeleted = (deletedReviewId) => {
    // Cập nhật state reviews bằng cách lọc ra review đã xóa
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error loading hotel details: {error}</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="container mx-auto px-4">
      <HotelDetailImages
        highLightImageUrl={hotel.highLightImageUrl}
        images={hotel.images}
      />

      <div className="flex justify-center items-center gap-4 ml-[170px]">
        <div className="w-full md:w-[55%] lg:w-[50%]">
          <HotelDetailInfo hotel={hotel} discounts={discounts} />
        </div>

        <div className="w-full md:w-[40%] lg:w-[45%]">
          <HotelDetailReserve hotel={hotel} />
        </div>
      </div>

      <HotelDetailAmenities
        amenities={Array.isArray(amenities) ? amenities : []}
      />
      <HotelDetailReviews
        reviews={Array.isArray(reviews) ? reviews : []}
        onAddReview={handleAddReviewSubmit}
        hotelId={hotelId}
        isSubmitting={isAddingReview} // Pass the loading state
        reviewError={postReviewError} // Truyền postReviewError từ usePost
        onReviewDeleted={handleReviewDeleted}
      />
      <OpenLayersMap hotel={hotel} />
    </div>
  );
}

export default HotelDetailPage;
