import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import WishList from "../components/WishList";

function WishListPage() {
  const token = useSelector((state) => state.auth.token);
  const [wishListItems, setWishListItems] = useState([]);

  const {
    data: fetchedWishList,
    loading: wishListLoading,
    error: wishListError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/user/hotel/wishlist");

  useEffect(() => {
    if (token) {
      fetchData({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [fetchData, token]);

  useEffect(() => {
    if (fetchedWishList) {
      setWishListItems(fetchedWishList);
    }
  }, [fetchedWishList]);

  const handleRemoveHotel = (hotelIdToRemove) => {
    setWishListItems((prevList) =>
      prevList.filter((hotel) => hotel.id !== hotelIdToRemove)
    );
  };

  if (wishListLoading) return <LoadingSpinner />;
  if (wishListError) return <p>Error loading favorites: {wishListError}</p>;
  if (!wishListItems || wishListItems.length === 0)
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
      <WishList wishList={wishListItems} onRemoveHotel={handleRemoveHotel} />
    </>
  );
}

export default WishListPage;