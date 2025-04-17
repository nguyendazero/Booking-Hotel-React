import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Button, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function RegionListPage() {
  const {
    data: regions,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/public/districts");
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
    return (
      <p className="text-red-500 font-semibold">
        Error fetching regions: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-lime-50 to-green-100 rounded-md shadow-lg">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-lime-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-lime-500">Regions</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-green-700 font-semibold">Manage</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-green-800">
          Region Management
        </h1>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
        >
          Add New Region
        </Button>
      </div>
      {regions && regions.length > 0 ? (
        <List
          className="divide-y divide-green-200"
          dataSource={regions}
          renderItem={(item) => (
            <List.Item className="py-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded shadow-sm"
                >
                  Edit
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded shadow-sm"
                >
                  Delete
                </Button>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No regions available.</p>
      )}
    </div>
  );
}

export default RegionListPage;
