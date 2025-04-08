import { useState, useCallback } from "react";
import axios from "axios";

const usePut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = useCallback(async (url, data = {}, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(url, data, config);
      return response;
    } catch (err) {
      console.error("usePut: PUT error:", err);
      setError(err?.response?.data?.errors?.[0]?.errorMessage || "An error occurred during the update.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { putData, loading, error };
};

export default usePut;