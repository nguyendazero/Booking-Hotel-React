import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Tag, Button, Space } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function PendingRegistrationsPage() {
  const {
    data: allRegistrations,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/owner-registrations");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  // Filter to show only pending registrations
  const filteredPendingRegistrations = allRegistrations
    ? allRegistrations.filter((reg) => reg.status === "PENDING")
    : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching pending registrations: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-orange-100 to-yellow-200 rounded-md shadow-lg">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-orange-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-orange-500">
            Registrations
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-orange-700 font-semibold">Pending</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-orange-800 mb-6">
        Pending Hotel Owner Registrations
      </h1>
      {filteredPendingRegistrations &&
      filteredPendingRegistrations.length > 0 ? (
        <List
          className="divide-y divide-yellow-300"
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredPendingRegistrations}
          renderItem={(registration) => (
            <List.Item className="py-4 bg-white rounded-md shadow-sm hover:shadow-md transition duration-200">
              <Card
                title={
                  <span className="text-lg font-semibold text-amber-600">
                    Registration ID: {registration.id}
                  </span>
                }
                style={{ width: "100%" }}
                className="shadow-none"
              >
                <p className="text-gray-700">
                  <strong className="text-blue-500">Full Name:</strong>{" "}
                  <span className="font-medium">
                    {registration.account.fullName}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Username:</strong>{" "}
                  <span className="font-medium">
                    {registration.account.username}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Email:</strong>{" "}
                  <span className="font-medium">
                    {registration.account.email}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong className="text-blue-500">Phone:</strong>{" "}
                  <span className="font-medium">
                    {registration.account.phone}
                  </span>
                </p>
                <p className="text-gray-700 flex items-center">
                  <strong className="text-blue-500 mr-2">Status:</strong>{" "}
                  <Tag color="warning" className="font-medium">
                    {registration.status}
                  </Tag>
                </p>
                <div className="mt-4 flex justify-end">
                  <Space>
                    <Button
                      icon={<CheckCircleOutlined />}
                      type="primary"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm"
                    >
                      Approve
                    </Button>
                    <Button
                      icon={<CloseCircleOutlined />}
                      type="default"
                      className="text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded-md shadow-sm border border-red-500"
                    >
                      Reject
                    </Button>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">
          No pending hotel owner registrations found.
        </p>
      )}
    </div>
  );
}

export default PendingRegistrationsPage;
