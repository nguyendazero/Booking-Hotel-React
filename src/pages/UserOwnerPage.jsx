import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Tag } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UserOwnerPage() {
  const {
    data: users,
    loading,
    error,
    fetchData,
  } = useFetch(`${API_BASE_URL}/api/v1/admin/accounts?role=ROLE_OWNER`);
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
        Error fetching owners: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-md shadow-md">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-teal-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-teal-500">Users</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-emerald-700 font-semibold">Owners</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">Hotel Owners</h1>
      {users && users.length > 0 ? (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user.id}>
              <Card
                className="rounded-md shadow-md hover:shadow-lg transition duration-300 border-emerald-200"
                title={
                  <div className="flex items-center">
                    <Avatar
                      src={user.avatar}
                      size="small"
                      className="mr-3 bg-green-500 text-white"
                    />
                    <span className="text-lg font-semibold text-gray-800">
                      {user.fullName}
                    </span>
                  </div>
                }
              >
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Username:</strong>{" "}
                  <span className="font-medium">{user.username}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Email:</strong>{" "}
                  <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Phone:</strong>{" "}
                  <span className="font-medium">{user.phone}</span>
                </p>
                {user.roles && user.roles.length > 0 && (
                  <p className="text-gray-700">
                    <strong className="text-blue-500">Roles:</strong>{" "}
                    {user.roles.map((role) => (
                      <Tag
                        key={role}
                        className="mr-1 font-medium"
                        style={{
                          color: "#16a34a",
                          backgroundColor: "#dcfce7",
                          borderColor: "#86efac",
                        }}
                      >
                        {role}
                      </Tag>
                    ))}
                  </p>
                )}
                {/* You can add more owner details or actions here */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No hotel owners found.</p>
      )}
    </div>
  );
}

export default UserOwnerPage;
