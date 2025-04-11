import React from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const ImageModal = ({
  open,
  onClose,
  images,
  loading,
  onAddImagesClick,
  addingImages,
  selectedFileCount,
  onConfirmAddImages,
}) => {
  return (
    <Modal
      title="Hotel Images"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} disabled={addingImages}>
          Cancel
        </Button>,
        selectedFileCount > 0 ? (
          <Button
            key="confirm"
            type="primary"
            loading={addingImages}
            onClick={onConfirmAddImages}
            disabled={addingImages}
          >
            Add {selectedFileCount} Image(s)
          </Button>
        ) : (
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddImagesClick}
            disabled={addingImages}
          >
            Select Images
          </Button>
        ),
      ]}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {selectedFileCount > 0 && (
            <p className="mb-2">{selectedFileCount} image(s) selected.</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={`Hotel Image ${image.id}`}
                className="w-[150px] h-[100px] object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ImageModal;
