import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Result } from "antd"; // Nhập Result và Button từ antd
import WishList from "../components/WishList";

function BookingHistoryPage() {
  //Get token from Redux
  const token = useSelector((state) => state.auth.token);

  const {
    data: wishList,
    loading: wishListLoading,
    error: wishListError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/user/hotel/wishlist");

  // Fetch bookings when token changes
  useEffect(() => {
    if (token) {
      fetchData({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [fetchData, token]);

  if (wishListLoading) return <LoadingSpinner />;
  if (wishListError)
    return <p>Error loading check-in details: {wishListError}</p>;
  if (!wishList || wishList.length === 0)
    return (
      <div className="mt-5 mb-5">
        <Result
          status="info"
          title="No hotels added to your favorites yet"
          subTitle="It seems you haven't marked any hotels as your favorites. Browse our listings and add your preferred accommodations here."
          extra={
            <Link to="/hotels">
              <Button type="primary" key="browseHotels">
                Browse Hotels
              </Button>
            </Link>
          }
        />
      </div>
    );

  return (
    <>
      <WishList wishList={wishList} />
    </>
  );
}

export default BookingHistoryPage;
