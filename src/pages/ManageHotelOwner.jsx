import React, { useEffect, useState } from "react";
import HotelManagement from "../components/HotelManagement";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Button, Result, message } from "antd";

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

  // State to control the Add Hotel modal
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  // Handle opening and closing of the Add Hotel modal
  const handleOpenAddHotelModal = () => {
    setIsAddHotelModalOpen(true);
  };

  const handleCloseAddHotelModal = () => {
    setIsAddHotelModalOpen(false);
  };

  // Callback to refresh hotels after adding a new hotel
  const handleHotelAdded = () => {
    message.success("Hotel added successfully!");
    fetchData(); // Refresh the hotel list
    setIsAddHotelModalOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Failed to fetch API with the current account.</p>;
  }

  if (!hotelsData || hotelsData.length === 0) {
    return (
      <div className="mt-5 mb-5 flex flex-col items-center justify-center">
        <Result
          status="info"
          title="No Hotels Found"
          subTitle="It appears you haven't created any hotel listings. Once you add a hotel, you'll be able to manage it here."
          extra={
            <Button
              className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-purple-700 focus:outline-none"
              onClick={handleOpenAddHotelModal}
            >
              Add Hotel
            </Button>
          }
        />
        {/* Add Hotel Modal */}
        <HotelManagement
          hotels={[]}
          onHotelAdded={handleHotelAdded}
          isAddHotelModalOpen={isAddHotelModalOpen}
          onCloseAddHotelModal={handleCloseAddHotelModal}
          onOpenAddHotelModal={handleOpenAddHotelModal}
        />
      </div>
    );
  }

  return (
    <>
      <HotelManagement
        hotels={hotelsData}
        onHotelAdded={fetchData}
        isAddHotelModalOpen={isAddHotelModalOpen}
        onCloseAddHotelModal={handleCloseAddHotelModal}
        onOpenAddHotelModal={handleOpenAddHotelModal}
      />
    </>
  );
}

export default ManageHotelOwnerPage;
