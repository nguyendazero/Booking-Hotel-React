import React, { useEffect } from "react";
import HotelManagement from "../components/HotelManagement";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function ManageHotelOwnerPage() {
  const user = useSelector((state) => state.auth.user);
  const {
    data: hotelsData,
    loading,
    error,
    fetchData,
  } = useFetch(
    `http://localhost:8080/api/v1/public/hotels?accountId=${user?.id}`
  );
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  const handleAddHotelPage = () => {
    navigate("/owner/add-hotel"); // Navigate to the add hotel page
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>fail to fetch API with account current</p>;
  }

  if (!hotelsData || hotelsData.length === 0) {
    return (
      <div className="mt-5 mb-5">
        <Result
          status="info"
          title="No Hotels Found"
          subTitle="It appears you haven't created any hotel listings. Once you add a hotel, you'll be able to manage it here."
          extra={
            <Button color="purple" variant="solid" onClick={handleAddHotelPage}>
              Add hotel
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <HotelManagement hotels={hotelsData} onHotelAdded={fetchData} />
    </>
  );
}

export default ManageHotelOwnerPage;
