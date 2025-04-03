import React, { useState } from "react";
import { Modal, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/searchSlice";

const AmenitiesModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const amenities = useSelector((state) => state.search.amenities || []);

  const handleAmenityChange = (amenityName) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((name) => name !== amenityName)
        : [...prev, amenityName]
    );
  };

  const handleApply = () => {
    dispatch(setQuery({ amenityNames: selectedAmenities }));
    onClose(); // Đóng modal
  };

  return (
    <Modal
      title="Select Amenities"
      open={open}
      onOk={handleApply}
      onCancel={onClose}
      okText="Apply"
      className="rounded-lg"
      style={{ padding: "20px", backgroundColor: "#FFF0F5" }} // Đặt màu nền cho thân modal
    >
      <div className="grid grid-cols-2 gap-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center">
            <Checkbox
              checked={selectedAmenities.includes(amenity.name)}
              onChange={() => handleAmenityChange(amenity.name)}
            >
              {amenity.name}
            </Checkbox>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AmenitiesModal;
