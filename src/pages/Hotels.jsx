import React from "react";
import { useLocation } from "react-router-dom"; // Thêm useLocation để lấy URL params
import { useSelector } from "react-redux"; // Import useSelector để truy cập Redux store
import HomePage1 from "../components/HomePage1";
import Hotels from "../components/Hotels";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner"; 
import ErrorPage from "./Error";

function HotelsPage() {
  const location = useLocation(); // Lấy URL params từ location
  const query = new URLSearchParams(location.search); // Parse query string từ URL

  const districtId = query.get("districtId");
  const name = query.get("name");
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const startDate = query.get("startDate");
  const endDate = query.get("endDate");

  // Truy cập amenities từ Redux
  const amenityNames = useSelector((state) => state.search.query.amenityNames) || [];
  const sortBy = useSelector((state) => state.search.query.sortBy); // Lấy tiêu chí sắp xếp từ Redux
  const sortOrder = useSelector((state) => state.search.query.sortOrder); // Lấy thứ tự sắp xếp từ Redux

  const fetchHotels = () => {
    let params = new URLSearchParams();
    
    if (districtId) params.append("districtId", districtId);
    if (name) params.append("name", name);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    // Thêm các amenityNames vào params
    amenityNames.forEach((amenity) => params.append("amenityNames", amenity));

    // Thêm các tiêu chí sắp xếp vào params
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    return `http://localhost:8080/api/v1/public/hotels${
      params.toString() ? "?" + params.toString() : ""
    }`;
  };

  // Sử dụng hook useFetch với URL đã xây dựng
  const { data: hotels, loading, error } = useFetch(fetchHotels());

  console.log(`Fetching hotels from URL: ${fetchHotels()}`);

  return (
    <>
      <HomePage1 title="Discover hotels & Bookings" />
      {loading && <LoadingSpinner />}
      {error && <ErrorPage />}
      <Hotels hotels={hotels} />
    </>
  );
}

export default HotelsPage;