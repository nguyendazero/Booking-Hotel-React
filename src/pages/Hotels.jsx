import React from "react";
import { useLocation } from "react-router-dom"; // Thêm useLocation để lấy URL params
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

  const fetchHotels = () => {
    let params = new URLSearchParams();
    
    if (districtId) params.append("districtId", districtId);
    if (name) params.append("name", name);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return `http://localhost:8080/api/v1/public/hotels${
      params.toString() ? "?" + params.toString() : ""
    }`;
  };

  // Sử dụng hook useFetch với URL đã xây dựng
  const { data: hotels, loading, error } = useFetch(fetchHotels());

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