import React, { useState } from "react";
import { Modal, Button, Input, List, message, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete";
import { formatDate } from "../util/dateUtils";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DiscountModal = ({
  open,
  onClose,
  hotelId,
  token,
  discounts,
  onDiscountsUpdated,
}) => {
  const [newDiscountRate, setNewDiscountRate] = useState("");
  const [newDiscountRange, setNewDiscountRange] = useState(null);
  
  const {
    postData: addDiscount,
    loading: addLoading,
    error: addError,
  } = usePost("http://localhost:8080/api/v1/owner/hotel-discount");

  const {
    deleteData: deleteDiscount,
    loading: deleteLoading,
    error: deleteError,
  } = useDelete();

  const handleAddDiscount = async () => {
    if (
      newDiscountRate.trim() &&
      newDiscountRange &&
      newDiscountRange.length === 2 &&
      hotelId
    ) {
      const startDate = dayjs(newDiscountRange[0]).format(
        "YYYY-MM-DDTHH:mm:ssZ"
      );
      const endDate = dayjs(newDiscountRange[1]).format("YYYY-MM-DDTHH:mm:ssZ");

      const requestData = {
        hotelId: hotelId,
        rate: parseFloat(newDiscountRate),
        startDate: startDate,
        endDate: endDate,
      };
      const response = await addDiscount(requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setNewDiscountRate("");
        setNewDiscountRange(null);

        onDiscountsUpdated(); //Fetch lại discount =
      } else if (addError) {
        message.error(`Failed to add discount: ${addError}`);
      }
    }
  };

  const handleDeleteDiscount = async (hotelDiscountId) => {
    if (hotelId && hotelDiscountId) {
      const response = await deleteDiscount(
        `http://localhost:8080/api/v1/owner/hotel-discount/${hotelDiscountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        onDiscountsUpdated();
      } else if (deleteError) {
        message.error(`Failed to delete discount: ${deleteError}`);
      }
    }
  };

  return (
    <Modal
      title="Discounts"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={addLoading || deleteLoading}
        >
          Cancel
        </Button>,
      ]}
    >
      <div>
        <div className="flex space-x-2 mb-3">
          <div className="mr-2">
            <Input
              placeholder="Value (%)"
              value={newDiscountRate}
              onChange={(e) => setNewDiscountRate(e.target.value)}
              type="number"
            />
          </div>

          <RangePicker
            value={newDiscountRange}
            onChange={(dates) => setNewDiscountRange(dates)}
            className="w-full"
          />

          <div className="ml-2">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddDiscount}
              loading={addLoading}
              disabled={
                !newDiscountRate.trim() ||
                !newDiscountRange ||
                newDiscountRange.length !== 2 ||
                !hotelId
              }
            />
          </div>
        </div>
        <List
          loading={!discounts}
          dataSource={discounts || []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  type="danger"
                  size="small"
                  onClick={() => handleDeleteDiscount(item.id)}
                  loading={deleteLoading}
                >
                  Delete
                </Button>,
              ]}
            >
              {item.discount?.rate}% - From {formatDate(item.startDate)} to{" "}
              {formatDate(item.endDate)}
            </List.Item>
          )}
        />
        {addError && <p className="text-red-600 font-bold mt-2">{addError}</p>}
        {deleteError && (
          <p className="text-red-600 font-bold mt-2">{deleteError}</p>
        )}
        {(addLoading || deleteLoading) && (
          <LoadingSpinner
            text={addLoading ? "Adding discount..." : "Deleting discount..."}
          />
        )}
      </div>
    </Modal>
  );
};

export default DiscountModal;
