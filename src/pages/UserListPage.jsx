import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function UserListPage() {
  const {
    data: users,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/accounts");
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchData({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [fetchData, token]);

  useEffect(() => {
    if (users) {
      const results = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [users, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching users: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-md shadow-md">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-purple-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-purple-500">Users</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-pink-700 font-semibold">User List</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Manage Users</h1>
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search by Name, Email, Username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-48 rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {filteredUsers && filteredUsers.length > 0 ? (
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item key={user.id}>
              <Card
                className="rounded-md shadow-md hover:shadow-lg transition duration-300 border-purple-200"
                title={
                  <div className="flex items-center">
                    <Avatar
                      src={user.avatar}
                      size="small"
                      className="mr-3 bg-indigo-500 text-white"
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
                          color: "#6d28d9",
                          backgroundColor: "#ede9fe",
                          borderColor: "#c4b5fd",
                        }}
                      >
                        {role}
                      </Tag>
                    ))}
                  </p>
                )}
                {/* You can add more user details or actions here */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">
          {searchTerm
            ? "No users found matching your search."
            : "No users found."}
        </p>
      )}
    </div>
  );
}

export default UserListPage;
