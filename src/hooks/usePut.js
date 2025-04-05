import { useState } from "react";
import axios from "axios";

const usePut = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (data, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(url, data, config); // Truyền config vào axios.put
      return response.data;
    } catch (err) {
      console.error("Error during putData", err);
      const errorMessage =
        err.response?.data?.errors?.[0]?.errorMessage ||
        "An unknown error occurred.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putData, loading, error };
};

export default usePut;
