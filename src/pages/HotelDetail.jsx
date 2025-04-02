import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import HotelDetailImages from "../components/HotelDetailImages";
import HotelDetailInfo from "../components/HotelDetailInfo";
import HotelDetailReserve from "../components/HotelDetailReserve";

function HotelDetailPage() {
  const { hotelId } = useParams();
  
  // Fetch thông tin chi tiết của khách sạn
  const { data: hotel, loading: hotelLoading, error: hotelError } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotelId}`
  );

  // Fetch danh sách giảm giá của khách sạn
  const { data: discounts, loading: discountLoading, error: discountError } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotelId}/discounts`
  );

  if (hotelLoading || discountLoading) return <p>Loading...</p>;
  if (hotelError || discountError) return <p>Error loading hotel details</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="container mx-auto px-4">
      <HotelDetailImages
        highLightImageUrl={hotel.highLightImageUrl}
        images={hotel.images}
      />

      <div className="flex justify-center items-center gap-4 ml-[170px]">
        <div className="w-full md:w-[55%] lg:w-[50%]">
          <HotelDetailInfo hotel={hotel} discounts={discounts}/>
        </div>

        <div className="w-full md:w-[40%] lg:w-[45%]">
          <HotelDetailReserve hotel={hotel} />
        </div>
      </div>
    </div>
  );
}

export default HotelDetailPage;
