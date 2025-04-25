import React, { useEffect } from "react";
import Statistic from "../components/Statistic";
import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function StatisticPage() {
  const token = useSelector((state) => state.auth.token);
  const {
    data: bookings,
    loading,
    error,
    fetchData,
  } = useFetch(`${API_BASE_URL}/api/v1/owner/statistic`);

  useEffect(() => {
    if (token) {
      fetchData({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token, fetchData]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <p>Error: {error}</p>}
      {bookings && <Statistic bookings={bookings} />}
    </>
  );
}

export default StatisticPage;
