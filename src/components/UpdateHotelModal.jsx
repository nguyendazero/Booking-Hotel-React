import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button } from "antd";

const UpdateHotelModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading,
  error,
  highlightImage,
  onHighlightImageChange,
  districtsData,
  districtsLoading,
  districtsError,
  initialValues, // Thêm prop để nhận dữ liệu ban đầu của khách sạn
}) => {
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
      // Nếu có highlightImage URL từ dữ liệu ban đầu, bạn có thể cần xử lý hiển thị nó ở đây
    } else if (!open) {
      form.resetFields();
      // Reset highlightImage state ở component cha nếu cần
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={
        <div className="text-xl font-semibold text-gray-800">Update Hotel</div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      className="rounded-lg shadow-xl overflow-hidden"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={initialValues} // Sử dụng initialValues để hiển thị dữ liệu ban đầu
        className="p-6 space-y-4"
      >
        <Form.Item
          name="name"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Hotel Name
            </span>
          }
          rules={[{ required: true, message: "Please enter the hotel name" }]}
        >
          <Input
            placeholder="Enter hotel name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </span>
          }
          rules={[
            { required: true, message: "Please enter the hotel description" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter hotel description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </Form.Item>
        <Form.Item
          name="pricePerDay"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Price Per Day
            </span>
          }
          rules={[{ required: true, message: "Please enter the price per day" }]}
        >
          <InputNumber
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min={0}
            placeholder="Enter price per day"
          />
        </Form.Item>
        <Form.Item
          name="highLightImageUrl"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Highlight Image
            </span>
          }
          // Không required ở đây, người dùng có thể không muốn thay đổi ảnh
        >
          <input
            type="file"
            accept="image/*"
            onChange={onHighlightImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {highlightImage && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(highlightImage)}
                alt="Highlight Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          {initialValues?.highLightImageUrl && !highlightImage && (
            <div className="mt-2">
              <img
                src={initialValues.highLightImageUrl}
                alt="Current Highlight"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-gray-500 text-xs mt-1">Current Image</p>
            </div>
          )}
        </Form.Item>
        <Form.Item
          name="streetAddress"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Street Address
            </span>
          }
          rules={[
            { required: true, message: "Please enter the street address" },
          ]}
        >
          <Input
            placeholder="Enter street address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="latitude"
            label={
              <span className="block text-gray-700 text-sm font-bold mb-2">
                Latitude
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter latitude",
              },
              {
                pattern: /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/,
                message: "Please enter a valid latitude (-90 to 90)",
              },
            ]}
          >
            <Input
              placeholder="Enter latitude"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
          <Form.Item
            name="longitude"
            label={
              <span className="block text-gray-700 text-sm font-bold mb-2">
                Longitude
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter longitude",
              },
              {
                pattern: /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/,
                message: "Please enter a valid longitude (-180 to 180)",
              },
            ]}
          >
            <Input
              placeholder="Enter longitude"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
        </div>
        <Form.Item
          name="districtId"
          label={
            <span className="block text-gray-700 text-sm font-bold mb-2">
              District
            </span>
          }
          rules={[{ required: true, message: "Please select a district" }]}
        >
          <Select
            loading={districtsLoading}
            placeholder="Select a district"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            options={
              districtsData?.map((district) => ({
                value: district.id,
                label: district.name,
              })) || []
            }
          >
            {/* Các option được tạo tự động từ prop options */}
          </Select>
          {districtsError && (
            <div className="text-red-500 text-sm mt-1">{districtsError}</div>
          )}
        </Form.Item>
        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Update Hotel
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </Form.Item>
        <div className="flex justify-end">
          <Button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateHotelModal;