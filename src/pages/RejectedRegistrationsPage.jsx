import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Tag } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function RejectedRegistrationsPage() {
  const {
    data: rejectedRegistrations,
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

  // Filter to show only rejected registrations
  const filteredRejectedRegistrations = rejectedRegistrations
    ? rejectedRegistrations.filter((reg) => reg.status === "REJECTED")
    : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching rejected registrations: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-red-100 to-orange-200 rounded-md shadow-lg">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-red-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-red-500">
            Registrations
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-red-700 font-semibold">Rejected</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-red-800 mb-6">
        Rejected Hotel Owner Registrations
      </h1>
      {filteredRejectedRegistrations &&
      filteredRejectedRegistrations.length > 0 ? (
        <List
          className="divide-y divide-orange-300"
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredRejectedRegistrations}
          renderItem={(registration) => (
            <List.Item className="py-4 bg-white rounded-md shadow-sm hover:shadow-md transition duration-200">
              <Card
                title={
                  <span className="text-lg font-semibold text-red-600">
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
                  <Tag color="error" className="font-medium">
                    {registration.status}
                  </Tag>
                </p>
                {/* You can add more details or actions for rejected registrations */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">
          No rejected hotel owner registrations found.
        </p>
      )}
    </div>
  );
}

export default RejectedRegistrationsPage;
