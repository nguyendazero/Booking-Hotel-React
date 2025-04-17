import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  List,
  Card,
  Avatar,
  Tag,
  Input,
  Pagination,
  Button,
  Modal,
  Form,
  Input as AntInput,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [userToBlock, setUserToBlock] = useState(null);
  const [blocking, setBlocking] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

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
      setCurrentPage(1); // Reset page when search term changes
    }
  }, [users, searchTerm]);

  useEffect(() => {
    if (filteredUsers) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedUsers(filteredUsers.slice(startIndex, endIndex));
    }
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showBlockModal = (userId) => {
    setUserToBlock(userId);
    setBlockModalVisible(true);
    setBlockReason("");
  };

  const handleBlockModalOk = async () => {
    if (!userToBlock) return;
    setBlocking(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/block-account/${userToBlock}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: blockReason }),
        }
      );

      if (response.status === 204) {
        message.success("Account has been blocked successfully.");
        setBlockModalVisible(false);
        setUserToBlock(null);
        setBlockReason("");
        fetchData({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const errorData = await response.json();
        message.error(
          `Failed to block account: ${
            errorData?.message || response.statusText
          }`
        );
      }
    } catch (error) {
      message.error(`Failed to block account: ${error.message}`);
    } finally {
      setBlocking(false);
    }
  };

  const handleBlockModalCancel = () => {
    setBlockModalVisible(false);
    setUserToBlock(null);
    setBlockReason("");
  };

  const handleUnblock = async (userId) => {
    setUserToUnblock(userId);
    setUnblocking(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/unblock-account/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        message.success("Account has been unblocked successfully.");
        fetchData({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Refetch user data
      } else {
        const errorData = await response.json();
        message.error(
          `Failed to unblock account: ${
            errorData?.message || response.statusText
          }`
        );
      }
    } catch (error) {
      message.error(`Failed to unblock account: ${error.message}`);
    } finally {
      setUnblocking(false);
      setUserToUnblock(null);
    }
  };

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
          <span className="text-pink-700 font-semibold">All</span>
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
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 font-semibold">
          Error fetching users: {error}
        </p>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <>
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
            dataSource={paginatedUsers}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <div className="rounded-md shadow-md hover:shadow-lg hover:scale-105 transition duration-300 border-purple-200 cursor-pointer">
                  <Card
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
                    actions={[
                      user.blockReason ? (
                        <Popconfirm
                          title="Are you sure you want to unblock this account?"
                          onConfirm={() => handleUnblock(user.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            key="unblock"
                            icon={<UnlockOutlined />}
                            className="text-green-500 hover:text-green-700"
                            loading={unblocking && userToUnblock === user.id}
                          >
                            Unblock
                          </Button>
                        </Popconfirm>
                      ) : (
                        <Button
                          key="block"
                          icon={<LockOutlined />}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => showBlockModal(user.id)}
                        >
                          Block
                        </Button>
                      ),
                    ]}
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
                    <p className="text-gray-700">
                      <strong className="text-blue-500">Status:</strong>{" "}
                      <span
                        className={
                          user.blockReason
                            ? "font-semibold text-red-600"
                            : "font-semibold text-green-600"
                        }
                      >
                        {user.blockReason ? "Locked" : "Activate"}
                      </span>
                    </p>
                  </Card>
                </div>
              </List.Item>
            )}
          />
          {filteredUsers.length > itemsPerPage && (
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredUsers.length}
              onChange={handlePageChange}
              className="mt-6 flex justify-center"
            />
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">
          {searchTerm
            ? "No users found matching your search."
            : "No users found."}
        </p>
      )}

      <Modal
        title="Reason for account lock"
        open={blockModalVisible}
        onOk={handleBlockModalOk}
        onCancel={handleBlockModalCancel}
        confirmLoading={blocking}
      >
        <Form>
          <Form.Item label="Lý do:">
            <AntInput.TextArea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserListPage;
