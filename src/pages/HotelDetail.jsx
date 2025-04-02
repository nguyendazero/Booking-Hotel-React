import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import HotelDetailImages from "../components/HotelDetailImages";

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
    <div>
      <HotelDetailImages
        highLightImageUrl={hotel.highLightImageUrl}
        images={hotel.images}
      />
    </div>
  );
}

export default HotelDetailPage;
