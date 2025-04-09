import React from "react";
import {
  Edit,
  Trash,
  Star,
  MapPin,
  Eye,
  Image,
  Percent,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { Button } from "antd";

const HotelManagement = ({ hotels }) => {
  // Check if hotels is defined before mapping

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star key={i} fill="#facc15" className="text-yellow-500" size={16} />
        );
      } else {
        stars.push(<Star key={i} className="text-gray-400" size={16} />);
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="container mx-auto mt-8 px-16 max-w-7xl">
      <div className="flex justify-end mb-4">
        <button
          className={`bg-purple-500 hover:bg-purple-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1
          `}
        >
          Add New Hotel
        </button>
      </div>
      <div className="space-y-6">
        {hotels !== null && hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Image Section */}
            <div className=" flex items-center justify-center">
              <img
                src={hotel.highLightImageUrl}
                alt={hotel.name}
                className="w-100 h-60 object-cover rounded-l-lg"
              />
            </div>

            {/* Content Section */}
            <div className="w-2/4 px-6 pb-6 flex flex-col justify-between">
              <div className="p-4 rounded-md">
                <h1 className="text-2xl font-bold text-purple-700 mb-3">
                  {hotel.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="mr-2 text-green-600" size={20} />
                  <span className="font-bold text-xl">
                    {hotel.streetAddress}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="font-bold mr-2 text-sm ">Price:</span>
                  <span className="text-sm">
                    ${hotel.pricePerDay}
                    {hotel.discount && (
                      <span className="text-xs text-green-500 ml-1">
                        {" "}
                        (-{hotel.discount?.rate}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <span className="font-bold mr-2 text-sm">Rating:</span>
                  <div className="ml-0.5">
                    {renderRatingStars(hotel.rating)}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    ({hotel.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {hotel.description}
                </p>
              </div>

              {/* Edit and Delete Buttons (moved here) */}
              <div className="flex justify-start items-center space-x-2 ml-4">
                <Button
                  color="primary"
                  icon={<Edit size={16} />}
                  variant="solid"
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  icon={<Trash size={16} />}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Action Buttons (Vertical) */}
            <div className="w-1/4 p-4 flex flex-col justify-center items-end space-y-2">
              <Button
                color="danger"
                variant="solid"
                className="w-32"
                icon={<Eye size={16} />}
              >
                View Review
              </Button>
              <Button
                color="purple"
                variant="solid"
                className="w-32"
                icon={<Percent size={16} />}
              >
                View Discount
              </Button>
              <Button
                color="primary"
                variant="solid"
                className="w-32"
                icon={<Image size={16} />}
              >
                View Images
              </Button>
              <Button
                color="cyan"
                variant="solid"
                className="w-32"
                icon={<ListChecks size={16} />}
              >
                View Amenities
              </Button>
              <Button
                color="pink"
                variant="solid"
                className="w-32"
                icon={<CalendarDays size={16} />}
              >
                View Booking
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelManagement;
