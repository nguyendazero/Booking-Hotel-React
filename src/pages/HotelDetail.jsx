import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import HotelDetailImages from "../components/HotelDetailImages";
import HotelDetailInfo from "../components/HotelDetailInfo";
import HotelDetailReserve from "../components/HotelDetailReserve";

function HotelDetailPage() {
  const { hotelId } = useParams();
  const {
    data: hotel,
    loading,
    error,
  } = useFetch(`http://localhost:8080/api/v1/public/hotel/${hotelId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading hotel details</p>;
  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="container mx-auto px-4">
      <HotelDetailImages
        highLightImageUrl={hotel.highLightImageUrl}
        images={hotel.images}
      />

      <div className="flex justify-center items-center gap-4 ml-[170px]">

        <div className="w-full md:w-[55%] lg:w-[50%]">
          <HotelDetailInfo hotel={hotel} />
        </div>

        <div className="w-full md:w-[40%] lg:w-[45%]">
          <HotelDetailReserve />
        </div>
      </div>
    </div>
  );
}

export default HotelDetailPage;
