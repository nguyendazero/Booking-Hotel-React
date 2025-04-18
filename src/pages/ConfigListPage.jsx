import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  List,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete";
import usePut from "../hooks/usePut";

function ConfigListPage() {
  const {
    data: configs,
    loading: fetchLoading,
    error: fetchError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/public/configs");
  const token = useSelector((state) => state.auth.token);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newConfig, setNewConfig] = useState({ key: "", value: "" });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [editedConfig, setEditedConfig] = useState({ key: "", value: "" });

  const {
    postData: addConfigApi,
    loading: addingConfig,
    error: addConfigError,
  } = usePost("http://localhost:8080/api/v1/admin/config");

  const {
    deleteData: deleteConfigApi,
    loading: deletingConfig,
    error: deleteConfigError,
  } = useDelete();
  const [configToDelete, setConfigToDelete] = useState(null);

  const {
    putData: updateConfigApi,
    loading: updatingConfig,
    error: updateConfigError,
  } = usePut();

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  useEffect(() => {
    if (addConfigError) {
      message.error(addConfigError);
    }
  }, [addConfigError]);

  useEffect(() => {
    if (deleteConfigError) {
      message.error(deleteConfigError);
    }
  }, [deleteConfigError]);

  useEffect(() => {
    if (updateConfigError) {
      message.error(updateConfigError);
    }
  }, [updateConfigError]);

  const showAddModal = () => {
    setAddModalVisible(true);
    setNewConfig({ key: "", value: "" });
  };

  const handleAddModalOk = async () => {
    if (!newConfig.key.trim() || !newConfig.value.trim()) {
      message.error("Config Name and Value cannot be empty.");
      return;
    }

    const config = { key: newConfig.key.trim(), value: newConfig.value.trim() };
    const configHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const responseData = await addConfigApi(config, configHeaders);

    if (responseData) {
      message.success(`Config "${newConfig.key.trim()}" added successfully.`);
      setAddModalVisible(false);
      setNewConfig({ key: "", value: "" });
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setNewConfig({ key: "", value: "" });
  };

  const showEditModal = (config) => {
    setEditingConfig(config);
    setEditedConfig({ key: config.name, value: config.value });
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    if (!editedConfig.key.trim() || !editedConfig.value.trim()) {
      message.error("Config Name and Value cannot be empty.");
      return;
    }

    if (!editingConfig?.id) return;

    const url = `http://localhost:8080/api/v1/admin/config/${editingConfig.id}`;
    const configData = {
      key: editedConfig.key.trim(),
      value: editedConfig.value.trim(),
    };
    const configHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await updateConfigApi(url, configData, configHeaders);

    if (response?.status === 204) {
      message.success(
        `Config "${editedConfig.key.trim()}" updated successfully.`
      );
      setEditModalVisible(false);
      setEditingConfig(null);
      setEditedConfig({ key: "", value: "" });
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditingConfig(null);
    setEditedConfig({ key: "", value: "" });
  };

  const handleDeleteConfirm = (id) => {
    setConfigToDelete(id);
    deleteConfigHandler(id);
  };

  const deleteConfigHandler = async (id) => {
    const url = `http://localhost:8080/api/v1/admin/config/${id}`;
    const configHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await deleteConfigApi(url, configHeaders);

    if (response?.status === 204) {
      message.success(`Config with ID ${id} deleted successfully.`);
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
    setConfigToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfigToDelete(null);
  };

  if (fetchLoading) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching configs: {fetchError}
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
          onClick={showAddModal}
          loading={addingConfig}
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
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded shadow-md"
                  onClick={() => showEditModal(item)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title={`Are you sure you want to delete "${item.name}"?`}
                  onConfirm={() => handleDeleteConfirm(item.id)}
                  onCancel={handleDeleteCancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded shadow-md"
                    loading={deletingConfig && configToDelete === item.id}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No configuration settings found.</p>
      )}

      <Modal
        title="Add New Configuration"
        open={addModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        confirmLoading={addingConfig}
      >
        <Form layout="vertical">
          <Form.Item label="Config Name:">
            <Input
              value={newConfig.key}
              onChange={(e) =>
                setNewConfig({ ...newConfig, key: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Config Value:">
            <Input
              value={newConfig.value}
              onChange={(e) =>
                setNewConfig({ ...newConfig, value: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Edit Configuration`}
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        confirmLoading={updatingConfig}
      >
        <Form layout="vertical">
          <Form.Item label="Config Name:">
            <Input
              value={editedConfig.key}
              onChange={(e) =>
                setEditedConfig({ ...editedConfig, key: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Config Value:">
            <Input
              value={editedConfig.value}
              onChange={(e) =>
                setEditedConfig({ ...editedConfig, value: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ConfigListPage;
