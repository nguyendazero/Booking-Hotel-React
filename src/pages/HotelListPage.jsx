import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Rate } from "antd";
import { StarOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function HotelListPage() {
  const { data: hotels, loading, error, fetchData } = useFetch(
    "http://localhost:8080/api/v1/public/hotels"
  );
  const token = useSelector((state) => state.auth.token); // You might not need this if it's a public API

  useEffect(() => {
    fetchData({
      // headers: { Authorization: `Bearer ${token}` }, // Remove this if it's a public API
    });
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-600 font-bold">Error fetching hotels: {error}</p>
    );
  }

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360, background: "#fff" }}
    >
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Hotels</Breadcrumb.Item>
        <Breadcrumb.Item>All</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Hotel List</h1>
      {hotels && hotels.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={hotels}
          renderItem={(hotel) => (
            <List.Item>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {hotel.name}
                    {hotel.rating && (
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={hotel.rating}
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </div>
                }
                cover={
                  <img
                    alt={hotel.name}
                    src={hotel.highLightImageUrl}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta
                  description={hotel.description}
                  style={{ marginBottom: 16 }}
                />
                <p>
                  <strong>Price per Day:</strong> {hotel.pricePerDay}
                </p>
                <p>
                  <strong>Address:</strong> {hotel.streetAddress}
                </p>
                {hotel.owner && (
                  <p>
                    <strong>Owner:</strong> {hotel.owner.fullName} (
                    {hotel.owner.email})
                  </p>
                )}
                {hotel.discount && (
                  <p>
                    <strong>Discount:</strong> {hotel.discount.rate}%
                  </p>
                )}
                {/* You can add more details here */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No hotels found.</p>
      )}
    </div>
  );
}

export default HotelListPage;