import React, { useState, useEffect } from "react";
import { Breadcrumb, List } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function RegionListPage() {
  const { data: regions, loading, error, fetchData } = useFetch(
    "http://localhost:8080/api/v1/public/districts"
  );
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-600 font-bold">Error fetching regions: {error}</p>;
  }

  return (
    <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: "#fff" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Regions</Breadcrumb.Item>
        <Breadcrumb.Item>Region List</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Region List</h1>
      {regions && regions.length > 0 ? (
        <List
          bordered
          dataSource={regions}
          renderItem={(item) => <List.Item>{item.name}</List.Item>}
        />
      ) : (
        <p>No regions available.</p>
      )}
    </div>
  );
}

export default RegionListPage;