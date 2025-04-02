import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import HotelDetailImages from "../components/HotelDetailImages";
import HotelDetailInfo from "../components/HotelDetailInfo";
import HotelDetailReserve from "../components/HotelDetailReserve";
import HotelDetailAmenities from "../components/HotelDetailAmenities";
import HotelDetailReviews from "../components/HotelDetailReviews";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import OpenLayersMap from "../components/OpenLayersMap";

function HotelDetailPage() {
  const { hotelId } = useParams();

  // Fetch thông tin chi tiết của khách sạn
  const {
    data: hotel,
    loading: hotelLoading,
    error: hotelError,
  } = useFetch(`http://localhost:8080/api/v1/public/hotel/${hotelId}`);

  // Fetch danh sách giảm giá của khách sạn
  const {
    data: discounts,
    loading: discountLoading,
    error: discountError,
  } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotelId}/discounts`
  );

  // Fetch danh sách amenity của khách sạn
  const {
    data: amenities,
    loading: amenitiyLoading,
    error: amenityError,
  } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotelId}/amenities`
  );

  // Fetch danh sách review của khách sạn
  const {
    data: reviews,
    loading: reviewLoading,
    error: reviewError,
  } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotelId}/ratings`
  );

  if (hotelLoading || discountLoading || amenitiyLoading || reviewLoading)
    return <LoadingSpinner />;
  if (hotelError || discountError || amenityError || reviewError)
    return <p>Error loading hotel details</p>;
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
      <OpenLayersMap hotel={hotel}/>
    </div>
  );
}

export default HotelDetailPage;
