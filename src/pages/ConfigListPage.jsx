import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Button, Space, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function ConfigListPage() {
  const {
    data: configs,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/public/configs");
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
        Error fetching configs: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-md shadow-lg">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-indigo-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-indigo-500">Configs</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-blue-700 font-semibold">Manage</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-indigo-800">
          Configuration Settings
        </h1>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md"
        >
          Add New Config
        </Button>
      </div>
      {configs && configs.length > 0 ? (
        <List
          className="divide-y divide-blue-200"
          dataSource={configs}
          renderItem={(item) => (
            <List.Item className="py-4 flex justify-between items-center">
              <div className="flex-grow">
                <strong className="text-blue-600 mr-2">Name:</strong>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <div className="flex-grow">
                <strong className="text-blue-600 mr-2">Value:</strong>
                <Tag color="geekblue" className="font-medium">
                  {item.value}
                </Tag>
              </div>
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
        <p className="text-gray-500 italic">No configuration settings found.</p>
      )}
    </div>
  );
}

export default ConfigListPage;
