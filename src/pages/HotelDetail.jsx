import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HotelDetailImages from "../components/HotelDetailImages";
import HotelDetailInfo from "../components/HotelDetailInfo";
import HotelDetailReserve from "../components/HotelDetailReserve";
import HotelDetailAmenities from "../components/HotelDetailAmenities";
import HotelDetailReviews from "../components/HotelDetailReviews";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import OpenLayersMap from "../components/OpenLayersMap";

function HotelDetailPage() {
  const { hotelId } = useParams();

  // State để lưu trữ dữ liệu và trạng thái loading, error
  const [hotel, setHotel] = useState(null);
  const [discounts, setDiscounts] = useState(null);
  const [amenities, setAmenities] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của khách sạn
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dữ liệu khách sạn
        const hotelRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}`
        );
        if (!hotelRes.ok) throw new Error("Failed to fetch hotel");
        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        // Fetch giảm giá
        const discountRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}/discounts`
        );
        if (!discountRes.ok) throw new Error("Failed to fetch discounts");
        const discountData = await discountRes.json();
        setDiscounts(discountData);

        // Fetch amenities
        const amenityRes = await fetch(
          `http://localhost:8080/api/v1/public/hotel/${hotelId}/amenities`
        );
        if (!amenityRes.ok) throw new Error("Failed to fetch amenities");
        const amenityData = await amenityRes.json();
        setAmenities(amenityData);

        // Fetch reviews
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
  }, [hotelId]); // Chạy lại khi hotelId thay đổi

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
      <HotelDetailReviews reviews={Array.isArray(reviews) ? reviews : []} />
      <OpenLayersMap hotel={hotel} />
    </div>
  );
}

export default HotelDetailPage;
