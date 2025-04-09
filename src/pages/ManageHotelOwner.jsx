import React, { useEffect } from "react";
import HotelManagement from "../components/HotelManagement";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Button, Result } from "antd";
import { ListChecks } from "lucide-react";

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

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

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
            <Button color="purple" variant="solid">
              Add hotel
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <HotelManagement hotels={hotelsData} />
    </>
  );
}

export default ManageHotelOwnerPage;
