import React, { useState } from "react";
import { Modal, Carousel } from "antd";

const HotelDetailImages = ({ highLightImageUrl, images }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const displayedImages = images.slice(0, 4);
  const remainingImages = images.length - 4;

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="px-50 py-2">
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {/* Hình ảnh nổi bật bên trái */}
        <div className="col-span-1 h-[450px]">
          <img
            src={highLightImageUrl}
            alt="Hotel Highlight"
            className="w-full h-full object-cover rounded-2xl transform transition-all hover:scale-105 hover:brightness-110" // Thêm hiệu ứng hover
          />
        </div>

        {/* Hình ảnh bên phải */}
        <div className="col-span-1 grid grid-cols-2 grid-rows-2 gap-2">
          {displayedImages.map((img, index) => (
            <div key={img.id} className="relative h-[220px]">
              <img
                src={img.imageUrl}
                alt={`Hotel Image ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl transform transition-all hover:scale-105 hover:brightness-110" // Thêm hiệu ứng hover
                style={{
                  opacity: index === 3 && remainingImages > 0 ? 0.5 : 1,
                }} // Làm mờ ảnh thứ 4
              />
              {/* Overlay nếu có nhiều hơn 4 ảnh */}
              {index === 3 && remainingImages > 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-purple-800 text-lg font-semibold rounded-2xl cursor-pointer"
                  onClick={openModal}
                >
                  +{remainingImages} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal hiển thị tất cả ảnh */}
      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <Carousel
          dots={false}
          afterChange={(current) => setCurrentSlide(current)}
          initialSlide={currentSlide}
          arrows
        >
          {[highLightImageUrl, ...images.map((img) => img.imageUrl)].map(
            (src, index) => (
              <div key={index} className="flex justify-center items-center">
                <img
                  src={src}
                  alt={`Slide ${index}`}
                  className="max-w-full max-h-[500px] object-contain"
                />
              </div>
            )
          )}
        </Carousel>
      </Modal>
    </div>
  );
};

export default HotelDetailImages;
