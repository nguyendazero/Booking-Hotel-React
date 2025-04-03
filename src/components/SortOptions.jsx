import React, { useEffect, useState } from "react"; // Thêm useState vào import
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/searchSlice";

const SortOptions = () => {
  const dispatch = useDispatch();
  
  // Lấy sortBy và sortOrder từ Redux store
  const currentSortBy = useSelector((state) => state.search.query.sortBy) || "id";
  const currentSortOrder = useSelector((state) => state.search.query.sortOrder) || "asc";

  // Khai báo state cho sortBy và sortOrder
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  useEffect(() => {
    // Dispatch initial sortInfo
    dispatch(setQuery({ sortBy, sortOrder }));
  }, [dispatch, sortBy, sortOrder]); // Chạy khi component được mount hoặc sortBy/sortOrder thay đổi

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortBy(value);
    // Dispatch với sortOrder hiện tại
    dispatch(setQuery({ sortBy: value, sortOrder }));
  };

  const handleOrderChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    // Dispatch với sortBy hiện tại
    dispatch(setQuery({ sortBy, sortOrder: value }));
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="text-gray-700">Sort by:</label>
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-full p-2"
      >
        <option value="id">Default</option>
        <option value="ratings">Ratings</option>
        <option value="pricePerDay">Price</option>
      </select>

      <div className="flex items-center space-x-2">
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="asc"
              checked={sortOrder === "asc"}
              onChange={handleOrderChange}
              className="form-radio text-purple-600"
            />
            <span className="ml-2">Ascending</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="desc"
              checked={sortOrder === "desc"}
              onChange={handleOrderChange}
              className="form-radio text-purple-600"
            />
            <span className="ml-2">Descending</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;